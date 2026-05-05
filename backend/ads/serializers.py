from rest_framework import serializers
from .models import Ad

class AdSerializer(serializers.ModelSerializer):
    salon_name = serializers.ReadOnlyField(source='salon.name')
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Ad
        fields = [
            'id', 'salon', 'salon_name', 'title', 'description', 'image', 
            'link_url', 'placement', 'status', 'start_date', 'end_date', 
            'is_paid', 'amount_paid', 'transaction_id', 'created_at'
        ]
        read_only_fields = ['is_paid', 'amount_paid', 'transaction_id', 'status']

    def get_image(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

