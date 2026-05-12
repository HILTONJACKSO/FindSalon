from rest_framework.routers import DefaultRouter
from .views import SalonViewSet, SalonImageViewSet, SalonCategoryViewSet, PortfolioItemViewSet

app_name = 'salons'

router = DefaultRouter()
router.register(r'categories', SalonCategoryViewSet)
router.register(r'images', SalonImageViewSet)
router.register(r'portfolio', PortfolioItemViewSet)
router.register(r'', SalonViewSet)

urlpatterns = router.urls
