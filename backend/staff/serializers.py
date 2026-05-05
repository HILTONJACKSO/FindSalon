from rest_framework import serializers
from .models import StaffMember, StaffActivity
from services.serializers import ServiceSerializer

class StaffMemberSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField(source='user.get_full_name')
    email_display = serializers.ReadOnlyField(source='user.email')
    assigned_services_data = ServiceSerializer(source='assigned_services', many=True, read_only=True)

    class Meta:
        model = StaffMember
        fields = [
            'id', 'salon', 'user', 'full_name', 'email_display', 
            'job_title', 'avatar', 'availability', 'performance_rating', 
            'assigned_services', 'assigned_services_data', 'created_at'
        ]
        read_only_fields = ['id', 'salon', 'user', 'created_at']

class StaffActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = StaffActivity
        fields = '__all__'
