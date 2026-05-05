from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ServiceCategoryViewSet

app_name = 'services'

router = DefaultRouter()
router.register(r'categories', ServiceCategoryViewSet, basename='service-category')
router.register(r'', ServiceViewSet)

urlpatterns = router.urls
