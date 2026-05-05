from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg
from .models import Review

@receiver([post_save, post_delete], sender=Review)
def update_staff_rating(sender, instance, **kwargs):
    if instance.staff_member:
        staff = instance.staff_member
        # Calculate new average rating
        avg_rating = Review.objects.filter(staff_member=staff).aggregate(Avg('rating'))['rating__avg']
        
        # Update staff member rating
        if avg_rating is not None:
            staff.performance_rating = round(float(avg_rating), 1)
        else:
            staff.performance_rating = 5.0 # Default if no reviews
            
        staff.save()
