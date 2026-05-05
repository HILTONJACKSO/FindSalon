import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from inventory.models import Product

count, _ = Product.objects.all().delete()
print(f"Successfully deleted {count} inventory products.")
