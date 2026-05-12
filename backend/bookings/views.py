from django.utils import timezone
from payments.utils import calculate_booking_pricing
from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['salon', 'status', 'date']
    ordering_fields = ['date', 'start_time']

    def get_queryset(self):
        user = self.request.user
        # SPEED OPTIMIZATION: Eager load related objects
        base_qs = Booking.objects.select_related('salon', 'user').prefetch_related('services', 'services__category')
        
        if user.role == 'ADMIN':
            return base_qs.all()
        elif user.role == 'OWNER':
            return base_qs.filter(salon__owner=user)
        return base_qs.filter(user=user)

    def create(self, request, *args, **kwargs):
        """
        Hyper-scale create method with distributed locking.
        """
    def create(self, request, *args, **kwargs):
        """
        Hyper-scale create method with diagnostic logging.
        """
        import traceback
        salon_id = request.data.get('salon')
        date = request.data.get('date')
        start_time = request.data.get('start_time')

        try:
            try:
                from .concurrency import HighConcurrencyBookingManager
                manager = HighConcurrencyBookingManager()
                if not manager.try_reserve_slot(salon_id, date, start_time):
                    return Response(
                        {"detail": "This slot was just taken by another user. Please try a different time."},
                        status=status.HTTP_409_CONFLICT
                    )
            except Exception as conn_err:
                print(f"CONCURRENCY ALERT: {conn_err}")
                manager = None

            response = super().create(request, *args, **kwargs)
            
            # DEEP DIAGNOSTIC: If DRF caught an error and returned 500
            if response.status_code == 500:
                error_log = os.path.join(settings.BASE_DIR, "booking_500_response.log")
                with open(error_log, "a") as f:
                    f.write(f"\n--- 500 DETECTED AT {timezone.now()} ---\n")
                    f.write(f"Data: {request.data}\n")
                    f.write(f"Response Content: {response.data}\n")
                    f.write("-----------------------------------\n")

            if manager:
                manager.release_slot(salon_id, date, start_time)
            return response


        except Exception as e:
            error_log = os.path.join(settings.BASE_DIR, "booking_error.log")
            with open(error_log, "a") as f:
                f.write(f"\n--- ERROR AT {timezone.now()} ---\n")
                f.write(traceback.format_exc())
                f.write("-----------------------------------\n")
            
            # Release the lock if we have one
            try:
                if 'manager' in locals() and manager:
                    manager.release_slot(salon_id, date, start_time)
            except:
                pass
                
            return Response({
                "detail": "A critical server error occurred during booking.",
                "debug_info": str(e),
                "traceback": traceback.format_exc()
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





    def perform_create(self, serializer):
        user = self.request.user
        # The actual booking creation
        booking = serializer.save(user=user)
        
        # 1. Calculate Base Price from selected services
        base_price = sum(service.price for service in booking.services.all())
        
        # 2. Run the FindSalon math
        pricing = calculate_booking_pricing(base_price)
        
        # 3. Store financial data in the booking
        booking.total_price = pricing["total_price"]
        booking.deposit_paid = 0.00 # Reset until MoMo success
        booking.balance_due = pricing["pay_at_salon"]
        booking.platform_fee = pricing["service_fee"]
        booking.salon_wallet_credit = pricing["salon_wallet_credit"]
        booking.save()

        # Trigger side effects safely in a background thread
        import threading
        def run_background_tasks(bid):
            try:
                from .tasks import process_booking_side_effects
                process_booking_side_effects.delay(bid)
            except Exception as e:
                print(f"ASYNC ALERT: Could not queue booking side effects: {e}")

        threading.Thread(target=run_background_tasks, args=(booking.id,), daemon=True).start()



    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def accept(self, request, pk=None):
        booking = self.get_object()
        if booking.salon.owner != request.user:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        
        booking.status = Booking.Status.CONFIRMED
        booking.save()
        return Response({'status': 'booking confirmed'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reject(self, request, pk=None):
        booking = self.get_object()
        if booking.salon.owner != request.user:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        
        booking.status = Booking.Status.CANCELLED
        booking.save()
        return Response({'status': 'booking cancelled'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def pay_deposit(self, request, pk=None):
        from payments.utils import MomoClient
        booking = self.get_object()
        momo_number = request.data.get('momo_number')
        
        if not momo_number:
            return Response({"detail": "MTN Mobile Money number is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Trigger MoMo payment for the deposit amount only
        momo = MomoClient()
        # Ensure we use the correct currency/environment from settings if needed
        ref_id, momo_status = momo.request_to_pay(
            amount=booking.deposit_paid or calculate_booking_pricing(sum(s.price for s in booking.services.all()))["pay_now"],
            phone=momo_number,
            external_id=str(booking.id),
            payee_note=f"Service Fee for {booking.salon.name}"
        )

        if ref_id:
            booking.transaction_id = ref_id
            booking.save()
            return Response({
                "status": "PENDING",
                "message": "Please confirm the payment on your phone",
                "transaction_id": ref_id
            })
        else:
            return Response({"detail": f"MoMo Initiation Failed: {momo_status}"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def complete(self, request, pk=None):
        booking = self.get_object()
        if booking.salon.owner != request.user:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
        
        booking.status = Booking.Status.COMPLETED
        booking.save()
        return Response({'status': 'booking completed'})
