from rest_framework import viewsets, permissions, filters
from django.utils import timezone

from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Salon, SalonImage, SalonCategory, PortfolioItem
from services.models import Service
from .serializers import SalonSerializer, SalonImageSerializer, SalonCategorySerializer, PortfolioItemSerializer

class PortfolioItemViewSet(viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.all().order_by('-created_at')
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['salon', 'category']
    search_fields = ['title', 'category']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'mine']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    def perform_create(self, serializer):
        salon = Salon.objects.filter(owner=self.request.user).first()
        if not salon:
            from rest_framework import serializers
            raise serializers.ValidationError({"detail": "You must create a salon profile before uploading portfolio items."})
        serializer.save(salon=salon)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def mine(self, request):
        items = PortfolioItem.objects.filter(salon__owner=request.user).order_by('-created_at')
        serializer = self.get_serializer(items, many=True)
        return Response(serializer.data)
from django.core.cache import cache

class SalonCategoryViewSet(viewsets.ModelViewSet):
    queryset = SalonCategory.objects.all().order_by('name')
    serializer_class = SalonCategorySerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

from core.permissions import IsOwnerOrReadOnly, IsAdminRoleOrStaff, IsOwnerOrAdmin

class SalonImageViewSet(viewsets.ModelViewSet):
    queryset = SalonImage.objects.all()
    serializer_class = SalonImageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SalonImage.objects.filter(salon__owner=self.request.user)

    def perform_create(self, serializer):
        salon = Salon.objects.filter(owner=self.request.user).first()
        if not salon:
            from rest_framework import serializers
            raise serializers.ValidationError({"detail": "You must create a salon profile before uploading images."})
        serializer.save(salon=salon)


class SalonViewSet(viewsets.ModelViewSet):
    # SPEED OPTIMIZATION: select_related and prefetch_related to avoid N+1
    queryset = Salon.objects.select_related('owner', 'category')\
        .prefetch_related(
            'images', 
            'staff_members', 
            'staff_members__user',
            models.Prefetch('services', queryset=Service.objects.all(), to_attr='_prefetched_services'),
            'reviews'
        ).all().order_by('-created_at')
    serializer_class = SalonSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['address']
    search_fields = ['name', 'description', 'address']

    def get_permissions(self):
        if self.action in ['mine', 'create']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        if self.action in ['followed', 'follow']:
            return [permissions.IsAuthenticated()]

        if self.action in ['update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        if self.action in ['approve', 'deactivate', 'reactivate', 'list_all']:
            return [IsAdminRoleOrStaff()]
        return [permissions.AllowAny()]



    def get_queryset(self):
        # Weighting: PRO (3) > TRIAL (2) > STARTER (1)
        qs = super().get_queryset().annotate(
            plan_weight=models.Case(
                models.When(subscription_plan='PRO', then=models.Value(3)),
                models.When(subscription_plan='TRIAL', then=models.Value(2)),
                models.When(subscription_plan='STARTER', then=models.Value(1)),
                default=models.Value(0),
                output_field=models.IntegerField(),
            )
        ).order_by('-plan_weight', '-created_at')

        user = self.request.user
        
        # Public-facing actions should ALWAYS filter by approved and active
        if self.action in ['list', 'curated']:
            return qs.filter(is_approved=True, is_active=True)

        if user.is_anonymous:
            return qs.filter(is_approved=True, is_active=True)
            
        if getattr(user, 'role', None) == 'ADMIN':
            return qs

        if self.action == 'retrieve':
            from django.db.models import Q
            return qs.filter(Q(is_approved=True, is_active=True) | Q(owner=user))
            
        if self.action in ['mine', 'update', 'partial_update', 'destroy']:
            return qs.filter(owner=user)

        return qs.filter(is_approved=True, is_active=True)

    def perform_create(self, serializer):
        user = self.request.user
        if getattr(user, 'role', None) == 'CUSTOMER':
            user.role = 'OWNER'
            user.save(update_fields=['role'])
        serializer.save(owner=user)

    def _clear_curated_cache(self):
        cache.delete('salons_curated')

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRoleOrStaff()])
    def approve(self, request, pk=None):

        salon = self.get_object()
        salon.is_approved = True
        salon.save()
        self._clear_curated_cache()
        
        # Create notification for owner
        try:
            from notifications.models import Notification
            Notification.objects.create(
                user=salon.owner,
                title="Salon Approved! 🥀",
                message=f"Congratulations! Your salon '{salon.name}' has been approved and is now live on Aura Luxe.",
                type='APPROVAL'
            )
        except Exception as e:
            print(f"Failed to create notification: {e}")
            
        return Response({'status': 'salon approved'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRoleOrStaff()])
    def deactivate(self, request, pk=None):
        salon = self.get_object()
        salon.is_active = False
        salon.save()
        self._clear_curated_cache()
        return Response({'status': 'salon deactivated'})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminRoleOrStaff()])
    def reactivate(self, request, pk=None):
        salon = self.get_object()
        salon.is_active = True
        salon.save()
        self._clear_curated_cache()
        return Response({'status': 'salon reactivated'})

    @action(detail=False, methods=['get'], permission_classes=[IsAdminRoleOrStaff()])
    def list_all(self, request):
        # Allow admins to see EVERYTHING
        salons = Salon.objects.all().order_by('-created_at')
        serializer = self.get_serializer(salons, many=True)
        data = serializer.data
        
        response = Response(data)
        response["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response["Pragma"] = "no-cache"
        response["Expires"] = "0"
        
        # DEBUG: Verify data presence
        if data and len(data) > 0:
            print(f"DEBUG: list_all call at {timezone.now()}")
            print(f"DEBUG: First salon name: {data[0].get('name')}, Approved: {data[0].get('is_approved')}")

            
        return response



    @action(detail=False, methods=['get'])
    def curated(self, request):
        # curated now uses the filtered queryset from get_queryset()
        cache_key = 'salons_curated'
        cached_data = cache.get(cache_key)
        if cached_data:
            return Response(cached_data)

        salons = self.get_queryset()[:3]
        serializer = self.get_serializer(salons, many=True)
        data = serializer.data
        cache.set(cache_key, data, 60 * 15)
        return Response(data)

    @action(detail=False, methods=['get'])
    def mine(self, request):
        user = request.user
        if getattr(user, 'role', None) == 'ADMIN':
            # For Admins, we return the first salon in the system for testing purposes
            # OR an empty list if they prefer. Let's return all for full visibility.
            salons = Salon.objects.all()
            serializer = self.get_serializer(salons, many=True)
        else:
            salons = Salon.objects.filter(owner=user)
        
        serializer = self.get_serializer(salons, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def followed(self, request):
        salons = self.get_queryset().filter(followers=request.user)
        serializer = self.get_serializer(salons, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def follow(self, request, pk=None):
        salon = self.get_object()
        user = request.user
        
        if salon.followers.filter(id=user.id).exists():
            salon.followers.remove(user)
            following = False
        else:
            salon.followers.add(user)
            following = True
            
        return Response({
            'following': following,
            'followers_count': salon.followers.count()
        })
