from rest_framework import serializers, viewsets, permissions
from rest_framework.decorators import action
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
        
        if plan not in ['ESSENTIAL', 'ELITE']:
            return Response({"detail": "Invalid plan."}, status=400)
        
        if not momo_number:
            return Response({"detail": "MTN Mobile Money number is required."}, status=400)

        amount = 15.00 if plan == 'ESSENTIAL' else 20.00
        
        # 1. Create a pending subscription payment record
        payment = SubscriptionPayment.objects.create(
            salon=salon,
            plan=plan,
            amount=amount,
            momo_number=momo_number,
            status='PENDING'
        )

        # 2. Call MTN MoMo API
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
