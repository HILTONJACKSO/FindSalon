from django.db import models
from django.conf import settings

class Notification(models.Model):
    class Type(models.TextChoices):
        APPROVAL = 'APPROVAL', 'Approval'
        BOOKING = 'BOOKING', 'Booking'
        BILLING = 'BILLING', 'Billing'
        SYSTEM = 'SYSTEM', 'System'
        BROADCAST = 'BROADCAST', 'Broadcast'
        PROMOTION = 'PROMOTION', 'Promotion'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=Type.choices, default=Type.SYSTEM)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.title}"

class AdminBroadcast(models.Model):
    class Target(models.TextChoices):
        ALL = 'ALL', 'All Users'
        OWNERS = 'OWNERS', 'Salon Owners Only'
        CUSTOMERS = 'CUSTOMERS', 'Customers Only'

    title = models.CharField(max_length=255)
    message = models.TextField()
    target_audience = models.CharField(max_length=20, choices=Target.choices, default=Target.ALL)
    created_at = models.DateTimeField(auto_now_add=True)
    is_sent = models.BooleanField(default=False)

    def __str__(self):
        return f"Broadcast: {self.title} to {self.target_audience}"
