from rest_framework import serializers
from .models import Booking
import datetime

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('id', 'user', 'salon', 'service', 'date', 'start_time', 'status', 'created_at')
        read_only_fields = ('id', 'user', 'status', 'created_at')

    def validate(self, data):
        # Time slot validation to prevent double booking
        date = data.get('date')
        start_time = data.get('start_time')
        salon = data.get('salon')
        if Booking.objects.filter(salon=salon, date=date, start_time=start_time, status__in=[Booking.Status.PENDING, Booking.Status.CONFIRMED]).exists():
            raise serializers.ValidationError("This time slot is already booked.")
        return data
