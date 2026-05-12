import os
import django
import sys

# Add backend to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from b2b_products.models import WholesaleOrder, Product

def fix_inventory():
    print("Starting inventory reconciliation...")
    orders = WholesaleOrder.objects.all()
    for order in orders:
        product = order.product
        print(f"Processing Order #{order.id}: {order.quantity} units of {product.name}")
        
        # In a real scenario, we'd check if this order was already accounted for.
        # Here we assume none of the existing orders (WS-1, WS-2) were deducted.
        product.stock -= order.quantity
        product.save()
        print(f"Updated {product.name}: New stock {product.stock}")
    
    print("Reconciliation complete!")

if __name__ == "__main__":
    fix_inventory()
