from rest_framework import serializers
from django.db import models
from .models import Salon, SalonImage, SalonCategory

class SalonCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonCategory
        fields = ('id', 'name', 'slug', 'description')
        read_only_fields = ('slug',)

class SalonImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalonImage
        fields = ('id', 'image', 'uploaded_at')

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            url = instance.image.url
            # Only build absolute URI if it's not already absolute
            if not url.startswith('http'):
                request = self.context.get('request')
                if request:
                    representation['image'] = request.build_absolute_uri(url)
                else:
                    # Fallback for when request context is missing
                    from django.conf import settings
                    base_url = getattr(settings, 'BACKEND_URL', 'http://127.0.0.1:8000')
                    representation['image'] = f"{base_url.rstrip('/')}{url}"
        return representation


class SalonSerializer(serializers.ModelSerializer):
    images = SalonImageSerializer(many=True, read_only=True)
    category_data = SalonCategorySerializer(source='category', read_only=True)
    rating = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    cover_image = serializers.SerializerMethodField()
    staff_count = serializers.SerializerMethodField()
    stylist_avatars = serializers.SerializerMethodField()
    offered_services = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    owner_email = serializers.SerializerMethodField()

    class Meta:
        model = Salon
        fields = ('id', 'owner', 'owner_email', 'name', 'description', 'address', 'latitude', 'longitude', 'opening_hours', 'images', 'category', 'category_data', 'rating', 'reviews_count', 'min_price', 'cover_image', 'staff_count', 'stylist_avatars', 'offered_services', 'followers_count', 'is_following', 'is_approved', 'is_active', 'salon_type', 'offers_home_service', 'subscription_plan', 'created_at')
        read_only_fields = ('id', 'owner', 'owner_email', 'created_at', 'rating', 'reviews_count', 'min_price', 'cover_image', 'staff_count', 'stylist_avatars', 'offered_services', 'followers_count', 'is_following', 'is_approved', 'is_active', 'salon_type', 'offers_home_service', 'subscription_plan')

    def get_owner_email(self, obj):
        try:
            return obj.owner.email if obj.owner else "No Owner"
        except:
            return "No Owner"

    def get_reviews_count(self, obj):
        try:
            return obj.reviews.count() if hasattr(obj, 'reviews') else 0
        except:
            return 0

    def get_offered_services(self, obj):
        try:
            if hasattr(obj, '_prefetched_services'):
                return list(set(s.name for s in obj._prefetched_services))
            return list(set(obj.services.values_list('name', flat=True)))
        except:
            return []

    def get_rating(self, obj):
        try:
            reviews = getattr(obj, 'reviews_list', None)
            if reviews is None:
                reviews = obj.reviews.all() if hasattr(obj, 'reviews') else []
            
            if not reviews:
                return 0.0
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        except:
            return 0.0

    def get_min_price(self, obj):
        try:
            if hasattr(obj, '_prefetched_services'):
                prices = [s.price for s in obj._prefetched_services]
                return float(min(prices)) if prices else 0.0
            min_p = obj.services.aggregate(models.Min('price'))['price__min']
            return float(min_p) if min_p is not None else 0.0
        except:
            return 0.0

    def get_cover_image(self, obj):
        try:
            first_image = obj.images.first()
            if first_image and hasattr(first_image, 'image') and first_image.image:
                request = self.context.get('request')
                url = first_image.image.url
                if request:
                    return request.build_absolute_uri(url)
                return url
        except:
            pass
        return None

    def get_staff_count(self, obj):
        try:
            return obj.staff_members.count() if hasattr(obj, 'staff_members') else 0
        except:
            return 0

    def get_stylist_avatars(self, obj):
        try:
            if not hasattr(obj, 'staff_members'):
                return []
            staff = obj.staff_members.all()[:2]
            request = self.context.get('request')
            avatars = []
            for s in staff:
                if s.user.avatar:
                    url = s.user.avatar.url
                    if request:
                        avatars.append(request.build_absolute_uri(url))
                    else:
                        avatars.append(url)
                else:
                    avatars.append(None)
            return avatars
        except:
            return []

    def get_followers_count(self, obj):
        try:
            return obj.followers.count() if hasattr(obj, 'followers') else 0
        except:
            return 0

    def get_is_following(self, obj):
        try:
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                return obj.followers.filter(id=request.user.id).exists()
        except:
            pass
        return False
