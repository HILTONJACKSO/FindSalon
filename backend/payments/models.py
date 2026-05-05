from django.db import models
from bookings.models import Booking

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
        
    class Method(models.TextChoices):
        CASH = 'CASH', 'Cash'
        MOBILE_MONEY = 'MOBILE_MONEY', 'Mobile Money'
        CARD = 'CARD', 'Card'

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name='payment')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.MOBILE_MONEY)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.id} for Booking {self.booking.id}"

from salons.models import Salon

class SubscriptionPayment(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='subscription_payments')
    plan = models.CharField(max_length=20, choices=Salon.Plan.choices)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    momo_number = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=Payment.Status.choices, default=Payment.Status.PENDING)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.salon.name} - {self.plan} - {self.status}"

class AdPayment(models.Model):
    ad = models.ForeignKey('ads.Ad', on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    momo_number = models.CharField(max_length=20)
    status = models.CharField(max_length=20, choices=Payment.Status.choices, default=Payment.Status.PENDING)
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ad Payment: {self.ad.title} - {self.status}"
