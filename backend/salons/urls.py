from rest_framework.routers import DefaultRouter
from .views import SalonViewSet

app_name = 'salons'

router = DefaultRouter()
router.register(r'', SalonViewSet)

urlpatterns = router.urls
