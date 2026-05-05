from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdViewSet, PublicAdView

router = DefaultRouter()
router.register(r'', AdViewSet, basename='ad-manage')

urlpatterns = [
    path('public/', PublicAdView.as_view(), name='ad-public'),
    path('', include(router.urls)),
]

