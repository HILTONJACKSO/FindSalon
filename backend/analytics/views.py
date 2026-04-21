from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from bookings.models import Booking
from payments.models import Payment
from salons.models import Salon
from rest_framework import status
from django.db.models import Sum, Count

class AnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        if user.role == 'ADMIN':
            data = {
                'total_salons': Salon.objects.count(),
                'total_bookings': Booking.objects.count(),
                'total_revenue': Payment.objects.filter(status=Payment.Status.COMPLETED).aggregate(Sum('amount'))['amount__sum'] or 0
            }
        elif user.role == 'OWNER':
            salons = user.salons.all()
            bookings = Booking.objects.filter(salon__in=salons)
            payments = Payment.objects.filter(booking__in=bookings, status=Payment.Status.COMPLETED)
            
            data = {
                'my_salons': salons.count(),
                'total_bookings': bookings.count(),
                'completed_bookings': bookings.filter(status=Booking.Status.COMPLETED).count(),
                'total_revenue': payments.aggregate(Sum('amount'))['amount__sum'] or 0
            }
        else:
            return Response({"detail": "Not authorized."}, status=status.HTTP_403_FORBIDDEN)
            
        return Response(data)
