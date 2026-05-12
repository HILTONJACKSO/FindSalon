from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductCategoryViewSet, ProductViewSet, WholesaleOrderViewSet

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet)
router.register(r'items', ProductViewSet)
router.register(r'orders', WholesaleOrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]
