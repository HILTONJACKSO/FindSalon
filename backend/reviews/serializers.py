from rest_framework import serializers
from .models import Review
from bookings.models import Booking

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('id', 'user', 'salon', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

    def validate(self, data):
        # Ensure user has a completed booking at this salon
        request = self.context.get('request')
        salon = data.get('salon')
        if not Booking.objects.filter(user=request.user, salon=salon, status=Booking.Status.COMPLETED).exists():
            raise serializers.ValidationError("You can only review salons where you have a completed booking.")
        
        # Rating 1-5
        if not (1 <= data.get('rating') <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
            
        return data
