from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, SubscriptionPaymentViewSet

app_name = 'payments'

router = DefaultRouter()
router.register(r'subscriptions', SubscriptionPaymentViewSet, basename='subscription')
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = router.urls
