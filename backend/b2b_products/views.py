from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ProductCategory, Product, WholesaleOrder
from .serializers import ProductCategorySerializer, ProductSerializer, WholesaleOrderSerializer
from core.permissions import IsOwnerOrAdmin, IsAdminRoleOrStaff

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer
    
    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [IsOwnerOrAdmin()]
        return [IsAdminRoleOrStaff()]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsOwnerOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['wholesale_price', 'created_at']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [IsOwnerOrAdmin()]
        return [IsAdminRoleOrStaff()]

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.method in permissions.SAFE_METHODS and getattr(self.request.user, 'role', '') == 'OWNER':
            return qs.filter(is_active=True)
        return qs

class WholesaleOrderViewSet(viewsets.ModelViewSet):
    serializer_class = WholesaleOrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or getattr(user, 'role', '') == 'ADMIN':
            return WholesaleOrder.objects.all().order_by('-created_at')
        return WholesaleOrder.objects.filter(owner=user).order_by('-created_at')

    def get_permissions(self):
        if self.action in ['update', 'partial_update']:
            return [IsAdminRoleOrStaff()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)
        
        if product.stock < quantity:
            from rest_framework.exceptions import ValidationError
            raise ValidationError(f"Insufficient stock. Only {product.stock} units available.")
            
        total_price = product.wholesale_price * quantity
        
        # Deduct stock
        product.stock -= quantity
        product.save()
        
        serializer.save(owner=self.request.user, total_price=total_price)

    def perform_update(self, serializer):
        instance = self.get_object()
        old_status = instance.status
        new_status = serializer.validated_data.get('status')
        
        # If status changes to CANCELLED, refund stock
        if old_status != 'CANCELLED' and new_status == 'CANCELLED':
            product = instance.product
            product.stock += instance.quantity
            product.save()
            
        serializer.save()
