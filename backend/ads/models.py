
from django.db import models
from django.conf import settings
from salons.models import Salon

class Ad(models.Model):
    PLACEMENT_CHOICES = [
        ('LANDING_PAGE', 'Landing Page Hero'),
        ('BOOKING_PAGE', 'Salon Booking Sidebar'),
        ('CLIENT_DASHBOARD', 'Client Dashboard Banner'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Payment'),
        ('ACTIVE', 'Active'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    ]

    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='ads')
    title = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='ads/', help_text="Upload ad banner")
    link_url = models.URLField(blank=True, help_text="Where the ad leads to (defaults to salon page)")
    
    placement = models.CharField(max_length=20, choices=PLACEMENT_CHOICES, default='LANDING_PAGE')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    start_date = models.DateField()
    end_date = models.DateField()
    
    is_paid = models.BooleanField(default=False)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    transaction_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} - {self.salon.name} ({self.placement})"

    class Meta:
        ordering = ['-created_at']
