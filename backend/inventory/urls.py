from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

app_name = 'inventory'

router = DefaultRouter()
router.register(r'', ProductViewSet)

urlpatterns = router.urls
