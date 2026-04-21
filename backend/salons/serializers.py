from rest_framework import serializers
from .models import Salon, SalonImage

class SalonImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonImage
        fields = ('id', 'image', 'uploaded_at')

class SalonSerializer(serializers.ModelSerializer):
    images = SalonImageSerializer(many=True, read_only=True)
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Salon
        fields = ('id', 'owner', 'name', 'description', 'address', 'latitude', 'longitude', 'opening_hours', 'images', 'rating', 'created_at')
        read_only_fields = ('id', 'owner', 'created_at', 'rating')

    def get_rating(self, obj):
        # We will calculate this based on reviews later
        # Default placeholder to prevent errors
        reviews = obj.reviews.all() if hasattr(obj, 'reviews') else []
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)
