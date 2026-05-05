import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from salons.models import SalonCategory

categories = [
    'Hair Salon',
    'Nail Spa',
    'Barbershop',
    'Beauty Parlor',
    'Massage & Spa',
    'Esthetician',
    'Tattoo & Piercing',
    'Makeup Studio'
]

for name in categories:
    cat, created = SalonCategory.objects.get_or_create(name=name)
    if created:
        print(f"Created category: {name}")
    else:
        print(f"Category already exists: {name}")
