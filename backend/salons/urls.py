from rest_framework.routers import DefaultRouter
from .views import SalonViewSet, SalonImageViewSet, SalonCategoryViewSet

app_name = 'salons'

router = DefaultRouter()
router.register(r'categories', SalonCategoryViewSet)
router.register(r'images', SalonImageViewSet)
router.register(r'', SalonViewSet)

urlpatterns = router.urls
