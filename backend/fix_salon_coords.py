import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from salons.models import Salon

try:
    salon = Salon.objects.get(id=5)
    salon.latitude = 6.270
    salon.longitude = -10.678
    salon.save()
    print(f"Updated {salon.name} (ID: 5) with Lat: 6.270, Lng: -10.678")
except Salon.DoesNotExist:
    print("Salon with ID 5 not found.")
except Exception as e:
    print(f"Error: {e}")
