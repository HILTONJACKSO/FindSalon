from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service, ServiceCategory
from .serializers import ServiceSerializer, ServiceCategorySerializer

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

class IsSalonOwnerOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and (getattr(request.user, 'role', None) in ['OWNER', 'ADMIN'])

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.salon.owner == request.user or getattr(request.user, 'role', None) == 'ADMIN'

@method_decorator(csrf_exempt, name='dispatch')
class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all().order_by('name')
    serializer_class = ServiceCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSalonOwnerOrReadOnly]
    pagination_class = None

    def get_queryset(self):
        user = self.request.user
        qs = ServiceCategory.objects.all()
        
        is_mine = self.request.query_params.get('mine') == 'true'
        if is_mine:
            if not user.is_authenticated:
                return ServiceCategory.objects.none()
            return qs.filter(salon__owner=user)

        if self.request.method in permissions.SAFE_METHODS:
            # Public view
            return qs.filter(salon__is_approved=True, salon__is_active=True)
            
        if not user.is_authenticated:
            return ServiceCategory.objects.none()
        if hasattr(user, 'role') and user.role == 'ADMIN':
            return qs
        return qs.filter(salon__owner=user)




    def perform_create(self, serializer):
        user = self.request.user
        salon = user.salons.first()
        serializer.save(salon=salon)

@method_decorator(csrf_exempt, name='dispatch')
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.select_related('salon', 'category').all().order_by('-created_at')
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsSalonOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['salon', 'category']
    search_fields = ['name', 'description']

    def get_queryset(self):
        user = self.request.user
        qs = Service.objects.select_related('salon', 'category').all()
        
        # 1. HANDLE EXPLICIT "MINE" REQUEST FROM DASHBOARD
        is_mine = self.request.query_params.get('mine') == 'true'
        if is_mine:
            if not user.is_authenticated:
                # Security: Never leak public services when 'mine' is requested
                return Service.objects.none()
            return qs.filter(salon__owner=user)

        # 2. STANDARD FILTERING
        # ADMIN sees everything
        if not user.is_anonymous and hasattr(user, 'role') and user.role == 'ADMIN':
            return qs

            
        # 3. PUBLIC/GUESTS see only approved/active services
        # We enforce a strict separation: public never sees owner-only logic
        return qs.filter(salon__is_approved=True, salon__is_active=True)



    def perform_create(self, serializer):
        user = self.request.user
        salon = user.salons.first()
        
        if not salon:
            from rest_framework import serializers
            raise serializers.ValidationError({"detail": "No salon found for this owner."})

        # Check subscription limits
        if salon.subscription_plan == 'ESSENTIAL':
            service_count = Service.objects.filter(salon=salon).count()
            if service_count >= 10:
                from rest_framework import serializers
                raise serializers.ValidationError({
                    "detail": "You have reached the limit of 10 services for the Essential plan. Please upgrade to Elite for unlimited listings."
                })
        
        serializer.save(salon=salon)

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def ticker(self, request):
        from django.db.models import F
        # 1. Get ALL active deals (discount_price < price)
        deals = Service.objects.filter(
            salon__is_approved=True, 
            salon__is_active=True,
            is_active=True,
            discount_price__isnull=False,
            discount_price__lt=F('price')
        ).select_related('salon', 'category')[:10]

        # 2. If deals < 5, fill with featured or top services
        services_list = list(deals)
        if len(services_list) < 5:
            featured = Service.objects.filter(
                salon__is_approved=True, 
                salon__is_active=True,
                is_active=True,
                is_featured=True
            ).exclude(id__in=[s.id for s in services_list]).select_related('salon', 'category')[:10 - len(services_list)]
            services_list.extend(list(featured))

        # 3. If still < 5, fill with general top services
        if len(services_list) < 5:
            general = Service.objects.filter(
                salon__is_approved=True, 
                salon__is_active=True,
                is_active=True
            ).exclude(id__in=[s.id for s in services_list]).select_related('salon', 'category')[:10 - len(services_list)]
            services_list.extend(list(general))

        serializer = self.get_serializer(services_list, many=True)
        return Response(serializer.data)
