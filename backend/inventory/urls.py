from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, ProductCategoryViewSet

app_name = 'inventory'

router = DefaultRouter()
router.register(r'categories', ProductCategoryViewSet, basename='product-category')
router.register(r'', ProductViewSet, basename='product')

urlpatterns = router.urls
