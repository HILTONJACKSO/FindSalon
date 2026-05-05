from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, ProductCategory
from .serializers import ProductSerializer, ProductCategorySerializer

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

class IsSalonOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and (request.user.role in ['OWNER', 'ADMIN'])

    def has_object_permission(self, request, view, obj):
        return obj.salon.owner == request.user or request.user.role == 'ADMIN'

@method_decorator(csrf_exempt, name='dispatch')
class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all().order_by('name')
    serializer_class = ProductCategorySerializer
    permission_classes = [permissions.IsAuthenticated, IsSalonOwner]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return ProductCategory.objects.none()
        if user.role == 'ADMIN':
            return ProductCategory.objects.all()
        return ProductCategory.objects.filter(salon__owner=user)

    def perform_create(self, serializer):
        user = self.request.user
        salon = user.salons.first()
        serializer.save(salon=salon)

@method_decorator(csrf_exempt, name='dispatch')
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('-last_restocked')
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated, IsSalonOwner]
    pagination_class = None
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['salon']
    search_fields = ['name']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return Product.objects.none()
        if user.role == 'ADMIN':
            return Product.objects.all()
        return Product.objects.filter(salon__owner=user)

    def perform_create(self, serializer):
        user = self.request.user
        salon = user.salons.first()
        serializer.save(salon=salon)
