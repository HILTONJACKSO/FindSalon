from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet, SubscriptionPaymentViewSet
from . import views

app_name = 'payments'

router = DefaultRouter()
router.register(r'subscriptions', SubscriptionPaymentViewSet, basename='subscription')
router.register(r'', PaymentViewSet, basename='payment')

urlpatterns = [
    path('webhook/momo/', views.momo_webhook, name='momo_webhook'),
    path('', include(router.urls)),
]
