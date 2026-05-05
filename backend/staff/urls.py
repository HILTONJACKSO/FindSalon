from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StaffMemberViewSet, StaffActivityViewSet

router = DefaultRouter()
router.register(r'activities', StaffActivityViewSet, basename='staff-activity')
router.register(r'', StaffMemberViewSet, basename='staff-member')

urlpatterns = [
    path('', include(router.urls)),
]
