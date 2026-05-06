from django.db import models
from django.conf import settings

class Salon(models.Model):
    class Plan(models.TextChoices):
        TRIAL = 'TRIAL', 'Free Trial'
        ESSENTIAL = 'ESSENTIAL', 'Essential'
        ELITE = 'ELITE', 'Elite'

    class Type(models.TextChoices):
        PHYSICAL = 'PHYSICAL', 'Physical Salon'
        INDEPENDENT = 'INDEPENDENT', 'Independent Pro (Home Service)'

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='salons')
    name = models.CharField(max_length=255, db_index=True)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=512, db_index=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    opening_hours = models.CharField(max_length=255, default="09:00 - 18:00")
    followers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='followed_salons', blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_approved = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # New Fields for Independent Pros
    salon_type = models.CharField(max_length=20, choices=Type.choices, default=Type.PHYSICAL)
    offers_home_service = models.BooleanField(default=False)
    
    # Subscription Fields
    subscription_plan = models.CharField(max_length=20, choices=Plan.choices, default=Plan.TRIAL)
    subscription_expiry = models.DateTimeField(null=True, blank=True)
    
    category = models.ForeignKey('SalonCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='salons')

    def save(self, *args, **kwargs):
        if not self.subscription_expiry:
            from django.utils import timezone
            from datetime import timedelta
            self.subscription_expiry = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def rating(self):
        try:
            reviews = self.reviews.all() if hasattr(self, 'reviews') else []
            if not reviews:
                return 0.0
            return round(sum(r.rating for r in reviews) / len(reviews), 1)
        except:
            return 0.0

    @property
    def reviews_count(self):
        try:
            return self.reviews.count() if hasattr(self, 'reviews') else 0
        except:
            return 0


class SalonCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Salon Categories"

    def __str__(self):
        return self.name

class SalonImage(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='salons/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
