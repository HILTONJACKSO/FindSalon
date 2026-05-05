from django.db import models
from django.conf import settings
from salons.models import Salon

class Customer(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='salon_customers')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='customer_profiles')
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    avatar = models.ImageField(upload_to='customers/avatars/', blank=True, null=True)
    
    total_spent = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    last_visit = models.DateTimeField(null=True, blank=True)
    top_service = models.CharField(max_length=255, blank=True, null=True)
    service_color = models.CharField(max_length=7, default="#E5EFFF") # Hex color for UI
    
    is_vip = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.salon.name}"

class CustomerActivity(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='activities')
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Customer Activities"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer.first_name}: {self.description}"
