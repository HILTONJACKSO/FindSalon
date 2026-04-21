from rest_framework import serializers
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = serializers.CharField()
        if 'username' in self.fields:
            del self.fields['username']

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        return token

    def validate(self, attrs):
        # Map 'email' to 'username' for the parent validate method
        attrs['username'] = attrs.get('email')
        return super().validate(attrs)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'phone', 'role', 'first_name', 'last_name')
        read_only_fields = ('id', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.CUSTOMER)

    class Meta:
        model = User
        fields = ('id', 'email', 'phone', 'first_name', 'last_name', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', User.Role.CUSTOMER)
        )
        return user
