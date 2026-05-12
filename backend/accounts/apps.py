from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        import firebase_admin
        from firebase_admin import credentials
        from django.conf import settings
        import os

        if not firebase_admin._apps:
            try:
                path = settings.FIREBASE_SERVICE_ACCOUNT_PATH
                if os.path.exists(path):
                    print(f"DEBUG: Initializing Firebase with path: {path}")
                    cred = credentials.Certificate(path)
                    firebase_admin.initialize_app(cred)
                    print("DEBUG: Firebase Admin initialized successfully.")
                else:
                    print(f"CRITICAL: Firebase service account file NOT FOUND at: {path}")
            except Exception as e:
                print(f"CRITICAL: Firebase Admin initialization failed: {e}")
