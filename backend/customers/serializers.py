from rest_framework import serializers
from .models import Customer, CustomerActivity

class CustomerActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerActivity
        fields = '__all__'

class CustomerSerializer(serializers.ModelSerializer):
    activities = CustomerActivitySerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Customer
        fields = [
            'id', 'salon', 'user', 'first_name', 'last_name', 'full_name', 
            'email', 'phone', 'avatar', 'total_spent', 'last_visit', 
            'top_service', 'service_color', 'is_vip', 'notes', 
            'activities', 'created_at'
        ]
        read_only_fields = ['id', 'salon', 'total_spent', 'last_visit', 'activities', 'created_at']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
