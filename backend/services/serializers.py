from rest_framework import serializers
from .models import Service, ServiceCategory

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = '__all__'
        read_only_fields = ('id', 'salon')

class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.SerializerMethodField()
    salon_name = serializers.SerializerMethodField()
    salon_rating = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'salon')

    def get_category_name(self, obj):
        return obj.category.name if obj.category else "General"

    def get_salon_name(self, obj):
        return obj.salon.name if obj.salon else "Unknown Salon"

    def get_salon_rating(self, obj):
        return obj.salon.rating if obj.salon else 5.0

