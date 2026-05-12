from django.db import models
from django.conf import settings
from salons.models import Salon
from services.models import Service
from django.core.exceptions import ValidationError

class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        CONFIRMED = 'CONFIRMED', 'Confirmed'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='bookings')
    services = models.ManyToManyField(Service, related_name='bookings')
    date = models.DateField(db_index=True)
    start_time = models.TimeField()
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    
    # Financial Tracking
    transaction_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    deposit_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    platform_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    salon_wallet_credit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        # Prevent double booking algorithm would go here (or in serializers for DRF)
        pass

    def __str__(self):
        try:
            user_email = self.user.email if self.user else "Unknown User"
            salon_name = self.salon.name if self.salon else "Unknown Salon"
            # Avoid hitting DB in __str__ if possible, but if needed, be safe
            return f"Booking {self.id}: {user_email} at {salon_name}"
        except:
            return f"Booking {self.id}"

