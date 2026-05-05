from rest_framework import serializers
from .models import Deal

class DealSerializer(serializers.ModelSerializer):
    salon_name = serializers.ReadOnlyField(source='salon.name')
    salon_address = serializers.ReadOnlyField(source='salon.address')
    salon_image = serializers.SerializerMethodField()

    class Meta:
        model = Deal
        fields = [
            'id', 'salon', 'salon_name', 'salon_address', 'salon_image', 
            'title', 'description', 'discount_percentage', 'discount_amount', 
            'promo_code', 'start_date', 'end_date', 'is_active', 'created_at'
        ]

    def get_salon_image(self, obj):
        first_image = obj.salon.images.first()
        if first_image and first_image.image:
            request = self.context.get('request')
            url = first_image.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None

    def validate(self, data):
        if data['start_date'] >= data['end_date']:
            raise serializers.ValidationError("End date must be after start date.")
        return data
