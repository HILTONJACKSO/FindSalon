from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Salon
from .serializers import SalonSerializer

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user

class SalonViewSet(viewsets.ModelViewSet):
    queryset = Salon.objects.all().order_by('-created_at')
    serializer_class = SalonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['address']
    search_fields = ['name', 'description', 'address']

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
