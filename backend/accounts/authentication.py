import firebase_admin
from firebase_admin import auth, credentials
from rest_framework import authentication
from rest_framework import exceptions
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

# Initialize Firebase Admin SDK
# You need to download your service account JSON file from Firebase Console
# and point to it in settings.FIREBASE_SERVICE_ACCOUNT_PATH
if not firebase_admin._apps:
    try:
        path = settings.FIREBASE_SERVICE_ACCOUNT_PATH
        print(f"DEBUG: Initializing Firebase with path: {path}")
        cred = credentials.Certificate(path)
        firebase_admin.initialize_app(cred)
        print("DEBUG: Firebase Admin initialized successfully.")
    except Exception as e:
        print(f"CRITICAL: Firebase Admin initialization failed: {e}")


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        try:
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            if not auth_header or not auth_header.startswith('Bearer '):
                return None
    
            id_token = auth_header.split(' ').pop()
            try:
                # Attempt official Firebase verification
                decoded_token = auth.verify_id_token(id_token)
            except Exception as e:
                # HYPER-SCALE FAILSAFE: In development, we can fallback to simple decoding if needed
                # For now, we return None to let other auth classes try
                print(f"DEBUG: Firebase Token Verification Failed: {e}")
                return None
    
            uid = decoded_token.get('uid')
            email = decoded_token.get('email')
    
            # HYPER-SCALE LOOKUP: Prioritize email as the universal identifier
            try:
                if email:
                    user, created = User.objects.get_or_create(
                        email=email,
                        defaults={'username': email, 'firebase_uid': uid}
                    )
                    if not user.firebase_uid:
                        user.firebase_uid = uid
                        user.save()
                else:
                    user = User.objects.get(firebase_uid=uid)
            except Exception as e:
                print(f"DEBUG: User lookup failed for {email}/{uid}: {e}")
                return None
    
            # Security check: Ensure the user account is active
            if not user.is_active:
                raise exceptions.AuthenticationFailed('User account is disabled.')
    
            return (user, None)
        except Exception as e:
            print(f"CRITICAL AUTH ERROR: {e}")
            return None

