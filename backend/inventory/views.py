from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductSerializer

class IsSalonOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.salon.owner == request.user

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-last_restocked')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsSalonOwner]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['salon']
    search_fields = ['name']
    
    def get_queryset(self):
        # Only return inventory items for salons owned by the logged-in user
        user = self.request.user
        if user.role == 'ADMIN':
            return Product.objects.all()
        return Product.objects.filter(salon__owner=user)
