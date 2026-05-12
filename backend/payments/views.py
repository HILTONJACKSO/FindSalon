from rest_framework import serializers, viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from django.db import models
from rest_framework.response import Response
from .models import Payment, SubscriptionPayment
from .utils import MomoClient
from salons.models import Salon
from django.utils import timezone
from datetime import timedelta
import uuid

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'booking', 'amount', 'status', 'method', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')

class SubscriptionPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPayment
        fields = '__all__'

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class SubscriptionPaymentViewSet(viewsets.ModelViewSet):
    queryset = SubscriptionPayment.objects.all()
    serializer_class = SubscriptionPaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return SubscriptionPayment.objects.all()
        return SubscriptionPayment.objects.filter(salon__owner=user)

    @action(detail=False, methods=['post'])
    def subscribe(self, request):
        user = request.user
        salon = user.salons.first()
        
        # If Admin is testing, pick the first salon in the system
        if not salon and user.role == 'ADMIN':
            salon = Salon.objects.first()

        if not salon:
            return Response({"detail": "No salon found to upgrade. Please create a salon first."}, status=400)

        plan = request.data.get('plan')
        momo_number = request.data.get('momo_number')
        
        if plan not in ['STARTER', 'PRO']:
            return Response({"detail": "Invalid plan."}, status=400)
        
        amount = 0.00 if plan == 'STARTER' else 10.00
        
        # 1. Create a pending/completed subscription payment record
        payment = SubscriptionPayment.objects.create(
            salon=salon,
            plan=plan,
            amount=amount,
            momo_number=momo_number if amount > 0 else "FREE_PLAN",
            status='COMPLETED' if amount == 0 else 'PENDING'
        )

        # If it's a free plan, activate immediately
        if amount == 0:
            salon.subscription_plan = plan
            if salon.subscription_expiry and salon.subscription_expiry > timezone.now():
                salon.subscription_expiry += timedelta(days=30)
            else:
                salon.subscription_expiry = timezone.now() + timedelta(days=30)
            salon.save()
            return Response({
                "status": "COMPLETED",
                "message": "FindSalon Starter activated instantly!",
                "payment_id": payment.id
            })

        if not momo_number:
            return Response({"detail": "MTN Mobile Money number is required for Pro plan."}, status=400)

        # 2. Call MTN MoMo API for Paid Plans
        momo = MomoClient()
        ref_id, momo_status = momo.request_to_pay(
            amount=amount,
            phone=momo_number,
            external_id=str(payment.id),
            payee_note=f"FindSalon {plan} Plan"
        )

        if ref_id:
            payment.transaction_id = ref_id
            payment.save()
            return Response({
                "status": "PENDING",
                "message": "Please confirm the payment on your phone",
                "payment_id": payment.id,
                "reference_id": ref_id
            })
        else:
            payment.status = 'FAILED'
            payment.save()
            return Response({"detail": f"MoMo Initiation Failed: {momo_status}"}, status=400)

    @action(detail=True, methods=['get'], url_path='check-status')
    def check_status(self, request, pk=None):
        payment = self.get_object()
        if payment.status != 'PENDING':
            return Response({"status": payment.status})

        momo = MomoClient()
        momo_status = momo.get_payment_status(payment.transaction_id)

        if momo_status == 'SUCCESSFUL':
            payment.status = 'COMPLETED'
            payment.save()
            
            # Upgrade Salon
            salon = payment.salon
            salon.subscription_plan = payment.plan
            if salon.subscription_expiry and salon.subscription_expiry > timezone.now():
                salon.subscription_expiry += timedelta(days=30)
            else:
                salon.subscription_expiry = timezone.now() + timedelta(days=30)
            salon.save()
            
            return Response({"status": "COMPLETED", "message": "Subscription activated!"})
        elif momo_status == 'FAILED':
            payment.status = 'FAILED'
            payment.save()
            return Response({"status": "FAILED"})
            
        return Response({"status": "PENDING"})

@method_decorator(csrf_exempt, name='dispatch')
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Payment.objects.all()
        elif user.role == 'OWNER':
            return Payment.objects.filter(booking__salon__owner=user)
        return Payment.objects.filter(booking__user=user)

@csrf_exempt
@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def momo_webhook(request):
    """
    MTN MoMo Callback Receiver
    Confirms deposit and credits salon wallet.
    """
    momo_data = request.data
    transaction_id = momo_data.get('externalId')
    payment_status = momo_data.get('status')
    
    # Check both externalId and X-Reference-Id if needed
    if not transaction_id:
        # Fallback to looking by ref-id if provided in a different field
        transaction_id = momo_data.get('financialTransactionId')

    try:
        # Find the pending booking (Check both id and transaction_id)
        booking = Booking.objects.filter(models.Q(transaction_id=transaction_id) | models.Q(id=transaction_id)).first()
        
        if not booking:
            logger.warning(f"WEBHOOK ALERT: Booking {transaction_id} not found.")
            return Response({"message": "Booking not found"}, status=404)
            
        if payment_status == "SUCCESSFUL":
            booking.status = Booking.Status.CONFIRMED
            booking.deposit_paid = booking.salon_wallet_credit + booking.platform_fee
            booking.save()
            
            # Credit the salon's digital wallet
            salon = booking.salon
            salon.wallet_balance += booking.salon_wallet_credit
            salon.save()
            
            logger.info(f"WEBHOOK SUCCESS: Booking {booking.id} confirmed. Salon {salon.name} credited ${booking.salon_wallet_credit}.")
            return Response({"message": "Deposit secured and appointment confirmed."}, status=200)
            
        elif payment_status == "FAILED":
            booking.status = Booking.Status.CANCELLED
            booking.save()
            logger.info(f"WEBHOOK FAILED: Booking {booking.id} cancelled due to payment failure.")
            return Response({"message": "Deposit payment rejected."}, status=200)
            
    except Exception as e:
        logger.error(f"WEBHOOK ERROR: {e}")
        return Response({"message": "Server Error"}, status=500)
    
    return Response({"message": "Processing"}, status=200)
