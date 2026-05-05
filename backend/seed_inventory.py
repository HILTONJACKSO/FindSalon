import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from inventory.models import Product
from salons.models import Salon
from accounts.models import User

# Try to find a salon
salon = Salon.objects.first()

if not salon:
    # Get or create an owner
    owner = User.objects.filter(role='OWNER').first()
    if not owner:
        owner = User.objects.filter(email='salon@gmail.com').first()
    if not owner:
        owner = User.objects.create_user(email='salon_owner@gmail.com', password='password123', role='OWNER')
    
    salon = Salon.objects.create(
        owner=owner,
        name='Default Salon',
        address='123 Main St'
    )

products_data = [
    {
        'name': 'Aura Silk Serum',
        'description': 'Professional finishing oil',
        'category': 'Hair Products',
        'sku': 'AS-992-SR',
        'price': 48.00,
        'image': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        'quantity': 42,
        'low_stock_threshold': 10
    },
    {
        'name': 'Velvet Hold Hairspray',
        'description': 'Extra strong finishing spray',
        'category': 'Hair Products',
        'sku': 'VH-110-HS',
        'price': 24.50,
        'image': 'https://images.unsplash.com/photo-1594434032014-9725521f205c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        'quantity': 3,
        'low_stock_threshold': 10
    },
    {
        'name': 'Luxe Hydra-Mist',
        'description': 'Post-facial cooling spray',
        'category': 'Skin Products',
        'sku': 'HM-484-SM',
        'price': 32.00,
        'image': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        'quantity': 0,
        'low_stock_threshold': 5
    },
    {
        'name': 'Pro-Precision Shears',
        'description': 'Rose gold titanium coating',
        'category': 'Tools & Equipment',
        'sku': 'TL-007-PS',
        'price': 185.00,
        'image': 'https://images.unsplash.com/photo-1590540179852-2110a54f813a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        'quantity': 8,
        'low_stock_threshold': 10
    }
]

for pdata in products_data:
    Product.objects.update_or_create(
        salon=salon,
        sku=pdata['sku'],
        defaults=pdata
    )

print("Inventory seeded successfully!")
