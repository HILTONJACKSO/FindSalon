from django.db import models
from django.conf import settings
from salons.models import Salon
from services.models import Service

class StaffMember(models.Model):
    class Availability(models.TextChoices):
        ON_DUTY = 'ON_DUTY', 'On Duty'
        ON_BREAK = 'ON_BREAK', 'On Break'
        OFF_SHIFT = 'OFF_SHIFT', 'Off Shift'

    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='staff_members')
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='staff_profile')
    
    job_title = models.CharField(max_length=100) # e.g., Master Stylist
    avatar = models.ImageField(upload_to='staff/avatars/', blank=True, null=True)
    
    availability = models.CharField(max_length=20, choices=Availability.choices, default=Availability.OFF_SHIFT)
    performance_rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    
    assigned_services = models.ManyToManyField(Service, blank=True, related_name='assigned_staff')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.email} - {self.job_title}"

class StaffActivity(models.Model):
    staff_member = models.ForeignKey(StaffMember, on_delete=models.CASCADE, related_name='activities')
    description = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Staff Activities"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.staff_member.user.email}: {self.description}"
