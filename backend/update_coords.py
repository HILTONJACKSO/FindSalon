import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from salons.models import Salon

# Update ID 1 (Broad Street)
s1 = Salon.objects.get(id=1)
s1.latitude = 6.3156
s1.longitude = -10.8074
s1.save()

# Update ID 2 (Old Road) - Moving further inland to avoid water
s2 = Salon.objects.get(id=2)
s2.latitude = 6.2975
s2.longitude = -10.7652
s2.save()

print("Salons updated with real coordinates.")
