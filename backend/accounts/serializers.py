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
        fields = ('id', 'email', 'phone', 'role', 'first_name', 'last_name', 'avatar', 'firebase_uid', 'date_joined', 'location')
        read_only_fields = ('id', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.ChoiceField(choices=User.Role.choices, default=User.Role.CUSTOMER)

    class Meta:
        model = User
        fields = ('id', 'email', 'phone', 'first_name', 'last_name', 'password', 'role', 'firebase_uid')

    def create(self, validated_data):
        email = validated_data['email']
        firebase_uid = validated_data.get('firebase_uid')
        
        try:
            # Check if user already exists
            user = User.objects.filter(email=email).first()
            if user:
                print(f"DEBUG: User with email {email} already exists. Linking firebase_uid.")
                if not user.firebase_uid:
                    user.firebase_uid = firebase_uid
                
                # Update other fields if provided
                user.first_name = validated_data.get('first_name', user.first_name)
                user.last_name = validated_data.get('last_name', user.last_name)
                user.phone = validated_data.get('phone', user.phone)
                user.role = validated_data.get('role', user.role)
                
                if validated_data.get('password'):
                    user.set_password(validated_data['password'])
                
                user.save()
                return user

            # Otherwise create new
            print(f"DEBUG: Creating new user with email {email}")
            user = User.objects.create_user(
                email=email,
                password=validated_data['password'],
                first_name=validated_data.get('first_name', ''),
                last_name=validated_data.get('last_name', ''),
                phone=validated_data.get('phone', ''),
                role=validated_data.get('role', User.Role.CUSTOMER),
                firebase_uid=firebase_uid
            )
            return user
        except Exception as e:
            print(f"DEBUG: Registration creation failed: {e}")
            import traceback
            print(traceback.format_exc())
            raise serializers.ValidationError(str(e))
