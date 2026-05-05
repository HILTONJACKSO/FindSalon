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

