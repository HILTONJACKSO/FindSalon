from rest_framework import serializers
from .models import Booking
import datetime

class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    services_details = serializers.SerializerMethodField(read_only=True)
    salon_details = serializers.SerializerMethodField(read_only=True)
    service_details = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Booking
        fields = ('id', 'user', 'user_email', 'user_phone', 'salon', 'salon_details', 'services', 'service_details', 'services_details', 'date', 'start_time', 'status', 'created_at')
        read_only_fields = ('id', 'user', 'status', 'created_at')

    def get_salon_details(self, obj):
        try:
            salon = obj.salon
            image_url = None
            if hasattr(salon, 'images') and salon.images.exists():
                first_img = salon.images.first()
                if first_img and hasattr(first_img, 'image') and first_img.image:
                    image_url = first_img.image.url
            
            return {
                'id': salon.id if salon else None,
                'name': salon.name if salon else "Unknown Salon",
                'image': image_url,
                'address': salon.address if salon else ""
            }
        except Exception as e:
            print(f"DEBUG: Error in get_salon_details: {e}")
            return None

    def get_service_details(self, obj):
        try:
            first_service = obj.services.first()
            if first_service:
                return {
                    'id': first_service.id,
                    'name': first_service.name
                }
        except:
            pass
        return None


    def get_services_details(self, obj):
        from services.serializers import ServiceSerializer
        return ServiceSerializer(obj.services.all(), many=True).data

    def validate(self, data):
        # Time slot validation to prevent double booking
        date = data.get('date')
        start_time = data.get('start_time')
        salon = data.get('salon')
        if Booking.objects.filter(salon=salon, date=date, start_time=start_time, status__in=[Booking.Status.PENDING, Booking.Status.CONFIRMED]).exists():
            raise serializers.ValidationError("This time slot is already booked.")
        return data
