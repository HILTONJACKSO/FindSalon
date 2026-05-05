from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, CustomerActivityViewSet

router = DefaultRouter()
router.register(r'activities', CustomerActivityViewSet, basename='customer-activity')
router.register(r'', CustomerViewSet, basename='customer')

urlpatterns = [
    path('', include(router.urls)),
]
