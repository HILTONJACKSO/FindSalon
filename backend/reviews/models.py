from django.db import models
from django.conf import settings
from salons.models import Salon

class Review(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='reviews')
    staff_member = models.ForeignKey('staff.StaffMember', on_delete=models.CASCADE, related_name='reviews', null=True, blank=True)
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'salon', 'staff_member')

    def __str__(self):
        return f"{self.rating} stars by {self.user.email} for {self.salon.name}"
