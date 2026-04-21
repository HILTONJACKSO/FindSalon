from django.db import models
from salons.models import Salon

class Product(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='products')
    name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=10)
    last_restocked = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.quantity}) - {self.salon.name}"
