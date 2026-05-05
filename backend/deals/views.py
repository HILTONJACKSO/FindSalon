from rest_framework import viewsets, permissions
from .models import Deal
from .serializers import DealSerializer
from salons.views import IsOwnerOrAdmin
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class DealViewSet(viewsets.ModelViewSet):
    queryset = Deal.objects.all()
    serializer_class = DealSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Deal.objects.all()
        if user.role == 'OWNER':
            return Deal.objects.filter(salon__owner=user)
        return Deal.objects.filter(is_active=True)

    def perform_create(self, serializer):
        # Additional validation or logic if needed
        serializer.save()
