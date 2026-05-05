from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from .models import Customer, CustomerActivity
from .serializers import CustomerSerializer, CustomerActivitySerializer

class CustomerViewSet(viewsets.ModelViewSet):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering_fields = ['total_spent', 'last_visit', 'created_at']

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Customer.objects.none()
        if user.role == 'ADMIN':
            return Customer.objects.all()
        return Customer.objects.filter(salon__owner=user)

    def perform_create(self, serializer):
        user = self.request.user
        salon = user.salons.first()
        customer = serializer.save(salon=salon)
        CustomerActivity.objects.create(
            customer=customer,
            description=f"New client registered: {customer.first_name} {customer.last_name}"
        )

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        total_customers = queryset.count()
        
        # Simple logic for active this month
        one_month_ago = timezone.now() - timezone.timedelta(days=30)
        active_this_month = queryset.filter(last_visit__gte=one_month_ago).count()
        
        avg_ltv = queryset.aggregate(Avg('total_spent'))['total_spent__avg'] or 0
        
        # New registrations percentage calculation
        current_month_regs = queryset.filter(created_at__gte=one_month_ago).count()
        last_month_start = one_month_ago - timezone.timedelta(days=30)
        previous_month_regs = queryset.filter(created_at__gte=last_month_start, created_at__lt=one_month_ago).count()
        
        reg_pct = 0
        if previous_month_regs > 0:
            reg_pct = ((current_month_regs - previous_month_regs) / previous_month_regs) * 100
        elif current_month_regs > 0:
            reg_pct = 100 # From 0 to something is 100% growth for this simplified metric
            
        return Response({
            'total_customers': total_customers,
            'active_this_month': active_this_month,
            'avg_ltv': round(float(avg_ltv), 2),
            'new_registrations_pct': round(reg_pct, 1),
            'current_month_registrations': current_month_regs
        })

class CustomerActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CustomerActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return CustomerActivity.objects.none()
        return CustomerActivity.objects.filter(customer__salon__owner=user).order_by('-created_at')[:10]
