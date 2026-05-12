from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import models
from datetime import timedelta
from .services import AnalyticsService
from salons.models import Salon

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role not in ['OWNER', 'ADMIN']:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
            
        salons = user.salons.all()
        
        kpis = AnalyticsService.get_owner_kpis(salons)
        portfolio = AnalyticsService.get_service_portfolio(salons)
        trajectory = AnalyticsService.get_financial_trajectory(salons)
        heatmap = AnalyticsService.get_booking_heatmap(salons)
        
        data = {
            **kpis,
            'service_portfolio': portfolio,
            'trajectory': trajectory,
            'heatmap': heatmap,
        }
            
        return Response(data)

@method_decorator(csrf_exempt, name='dispatch')
class DashboardOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role not in ['OWNER', 'ADMIN']:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
            
        salons = user.salons.all()
        data = AnalyticsService.get_dashboard_overview(salons)
        return Response(data)

@method_decorator(csrf_exempt, name='dispatch')
class AdminAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'ADMIN':
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
            
        data = AnalyticsService.get_admin_overview()
        return Response(data)
