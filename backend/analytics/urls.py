from django.urls import path
from .views import AnalyticsView, DashboardOverviewView, AdminAnalyticsView

app_name = 'analytics'

urlpatterns = [
    path('', AnalyticsView.as_view(), name='analytics'),
    path('overview/', DashboardOverviewView.as_view(), name='dashboard_overview'),
    path('admin/', AdminAnalyticsView.as_view(), name='admin_analytics'),
]
