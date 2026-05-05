import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from salons.models import Salon

salons = Salon.objects.all()
for s in salons:
    print(f"ID: {s.id}, Name: {s.name}, Address: {s.address}, Lat: {s.latitude}, Lng: {s.longitude}")
