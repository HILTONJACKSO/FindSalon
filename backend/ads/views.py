from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .models import Ad
from .serializers import AdSerializer
from core.permissions import IsOwnerOrAdmin, IsAdminRoleOrStaff

@method_decorator(csrf_exempt, name='dispatch')
class AdViewSet(viewsets.ModelViewSet):
    queryset = Ad.objects.all()
    serializer_class = AdSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def get_permissions(self):
        if self.action == 'approve':
            return [permissions.IsAuthenticated(), IsAdminRoleOrStaff()]
        return super().get_permissions()



    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and (user.role == 'ADMIN' or user.is_staff):
            return Ad.objects.all()
        return Ad.objects.filter(salon__owner=user)

    def perform_create(self, serializer):
        user = self.request.user
        salon = user.salons.first()
        if not salon and user.role != 'ADMIN':
            from rest_framework.exceptions import ValidationError
            raise ValidationError("You must own a salon to create an ad.")
        
        serializer.save(salon=salon if salon else serializer.validated_data.get('salon'))

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        try:
            ad = self.get_object()
            ad.status = 'ACTIVE'
            ad.is_paid = True
            ad.save()
            
            # Notify Owner
            try:
                from notifications.models import Notification
                Notification.objects.create(
                    user=ad.salon.owner,
                    title="Ad Campaign Approved! 🚀",
                    message=f"Your ad campaign '{ad.title}' has been approved and is now live.",
                    type='APPROVAL'
                )
            except Exception as e:
                print(f"DEBUG: Failed to create notification: {e}")
                
            return Response({'status': 'ad approved'})
        except Exception as e:
            import traceback
            traceback.print_exc()
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@method_decorator(csrf_exempt, name='dispatch')
class PublicAdView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        placement = request.query_params.get('placement')
        ads = Ad.objects.filter(status='ACTIVE', is_paid=True)
        
        if placement:
            ads = ads.filter(placement=placement)
            
        ads = ads.order_by('-created_at')[:6]
            
        serializer = AdSerializer(ads, many=True, context={'request': request})

        return Response(serializer.data)
