from rest_framework import serializers, viewsets, permissions
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'booking', 'amount', 'status', 'method', 'created_at')
        read_only_fields = ('id', 'status', 'created_at')

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
