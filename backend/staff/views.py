from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Count
from .models import StaffMember, StaffActivity
from .serializers import StaffMemberSerializer, StaffActivitySerializer

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class StaffMemberViewSet(viewsets.ModelViewSet):
    serializer_class = StaffMemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'job_title']
    ordering_fields = ['performance_rating', 'created_at']

    def perform_create(self, serializer):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        email = self.request.data.get('email')
        first_name = self.request.data.get('first_name', '')
        last_name = self.request.data.get('last_name', '')
        
        if not email:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"email": "Email is required"})

        # 1. Create or get user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'role': 'STAFF'
            }
        )
        if created:
            user.set_password('staff123') 
            user.save()
        elif user.role != 'STAFF':
            user.role = 'STAFF'
            user.save()
            
        # 2. Get Salon
        salon = self.request.user.salons.first()
        if not salon:
            from salons.models import Salon
            salon = Salon.objects.first()
            
        # 3. Create or update profile
        staff, created = StaffMember.objects.update_or_create(
            user=user,
            defaults={
                'salon': salon,
                'job_title': self.request.data.get('job_title'),
                'availability': self.request.data.get('availability', 'OFF_SHIFT'),
            }
        )
        
        desc = "New team member added" if created else "Team member profile updated"
        StaffActivity.objects.create(staff_member=staff, description=f"{desc}: {first_name} {last_name}")

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return StaffMember.objects.none()
        if user.role == 'ADMIN':
            return StaffMember.objects.all()
        return StaffMember.objects.filter(salon__owner=user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        total_members = queryset.count()
        on_duty = queryset.filter(availability='ON_DUTY').count()
        avg_perf = queryset.aggregate(Avg('performance_rating'))['performance_rating__avg'] or 0
        
        # New hires this month (mocked logic similar to customers)
        import datetime
        from django.utils import timezone
        one_month_ago = timezone.now() - datetime.timedelta(days=30)
        new_hires = queryset.filter(created_at__gte=one_month_ago).count()
        
        return Response({
            'total_members': total_members,
            'on_duty_today': on_duty,
            'performance_avg': round(float(avg_perf), 1),
            'new_hires_month': new_hires
        })

@method_decorator(csrf_exempt, name='dispatch')
class StaffActivityViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = StaffActivitySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_anonymous:
            return StaffActivity.objects.none()
        return StaffActivity.objects.filter(staff_member__salon__owner=user).order_by('-created_at')[:10]
