import firebase_admin
from firebase_admin import auth, credentials
from rest_framework import authentication
from rest_framework import exceptions
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

# Firebase initialization moved to accounts/apps.py


class FirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        try:
            # Use request.headers for more reliable header retrieval in modern Django
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return None
    
            id_token = auth_header.split(' ').pop()
            try:
                # Attempt official Firebase verification
                decoded_token = auth.verify_id_token(id_token)
            except Exception as e:
                print(f"DEBUG: Firebase Token Verification Failed: {e}")
                # Raising AuthenticationFailed ensures a 401 response instead of a 403
                raise exceptions.AuthenticationFailed(f"Invalid Firebase token: {str(e)}")
    
            uid = decoded_token.get('uid')
            email = decoded_token.get('email')
    
            if not uid:
                print("DEBUG: Firebase token verified but no UID found.")
                return None

            # HYPER-SCALE LOOKUP: Prioritize email as the universal identifier
            try:
                if email:
                    user, created = User.objects.get_or_create(
                        email=email,
                        defaults={'firebase_uid': uid, 'role': User.Role.CUSTOMER}
                    )
                    if not user.firebase_uid:
                        user.firebase_uid = uid
                        user.save(update_fields=['firebase_uid'])
                else:
                    user = User.objects.get(firebase_uid=uid)
            except User.DoesNotExist:
                print(f"DEBUG: User not found in Django DB for UID {uid}. Creating stub.")
                user = User.objects.create(
                    email=f"{uid}@firebase.internal",
                    firebase_uid=uid,
                    role=User.Role.CUSTOMER
                )
            except Exception as e:
                print(f"DEBUG: Unexpected error during user lookup/creation: {e}")
                raise exceptions.AuthenticationFailed(f"User synchronization failed: {str(e)}")
    
            # Security check: Ensure the user account is active
            if not user.is_active:
                print(f"DEBUG: User {user.email} is inactive.")
                raise exceptions.AuthenticationFailed('User account is disabled.')
    
            return (user, decoded_token)
            
        except exceptions.AuthenticationFailed:
            # Re-raise authentication failures so DRF handles them
            raise
        except Exception as e:
            print(f"CRITICAL AUTH ERROR in FirebaseAuthentication: {e}")
            # If we hit an unexpected error, we return None to let other classes try,
            # but usually this means we're in a bad state.
            return None

    def authenticate_header(self, request):
        # This ensures DRF returns a 401 instead of a 403 when authentication is required but fails.
        return 'Bearer'

