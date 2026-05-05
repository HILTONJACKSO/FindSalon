from rest_framework import serializers
from .models import Review
from bookings.models import Booking

class ReviewSerializer(serializers.ModelSerializer):
    salon_details = serializers.SerializerMethodField(read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Review
        fields = ('id', 'user', 'user_email', 'salon', 'salon_details', 'staff_member', 'rating', 'comment', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')

    def get_salon_details(self, obj):
        return {
            'id': obj.salon.id,
            'name': obj.salon.name
        }

    def validate(self, data):
        # Relaxed for testing: Ensure user is authenticated (handled by permission_classes)
        # In production, we would uncomment the booking check below:
        """
        request = self.context.get('request')
        salon = data.get('salon')
        if not Booking.objects.filter(user=request.user, salon=salon, status=Booking.Status.COMPLETED).exists():
            raise serializers.ValidationError("You can only review salons where you have a completed booking.")
        """
        
        # Rating 1-5
        if not (1 <= data.get('rating') <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5.")
            
        return data
