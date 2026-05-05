from django.db import models
from salons.models import Salon

class ProductCategory(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='product_categories')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} - {self.salon.name}"

class Product(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(ProductCategory, on_delete=models.SET_NULL, null=True, related_name='products')
    sku = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    image = models.ImageField(upload_to='inventory/', blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    last_restocked = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.quantity}) - {self.salon.name}"
