from django.db import models
from django.conf import settings

class Salon(models.Model):
    class Plan(models.TextChoices):
        TRIAL = 'TRIAL', 'Free Trial'
        STARTER = 'STARTER', 'FindSalon Starter'
        PRO = 'PRO', 'FindSalon Pro'

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
    
    # Deposit Settings
    require_deposit = models.BooleanField(default=False)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Financials
    wallet_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.subscription_expiry:
            from django.utils import timezone
            from datetime import timedelta
            self.subscription_expiry = timezone.now() + timedelta(days=30)
            
        # Automatic Geocoding
        should_geocode = False
        if not self.latitude or not self.longitude:
            should_geocode = True
        elif self.pk:
            try:
                old_instance = Salon.objects.get(pk=self.pk)
                if old_instance.address != self.address:
                    should_geocode = True
            except Salon.DoesNotExist:
                pass
                
        if should_geocode and self.address:
            try:
                import requests
                import time
                
                import urllib.parse
                
                # Refine query for Liberia if not present
                query = self.address
                if "Liberia" not in query:
                    query += ", Liberia"
                
                # URL encode the query
                encoded_query = urllib.parse.quote(query)
                
                # Add a small delay to respect Nominatim's usage policy if needed, 
                # though usually one-off saves are fine.
                url = f"https://nominatim.openstreetmap.org/search?q={encoded_query}&format=json&limit=1"
                headers = {'User-Agent': 'FindSalon-App/1.0'}
                response = requests.get(url, headers=headers, timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    if data and len(data) > 0:
                        self.latitude = data[0]['lat']
                        self.longitude = data[0]['lon']
                    else:
                        # Fallback to Monrovia, Liberia if Nominatim cannot find the specific local address
                        self.latitude = 6.315600
                        self.longitude = -10.807400
                else:
                    self.latitude = 6.315600
                    self.longitude = -10.807400
            except Exception as e:
                # Log error but don't block saving the salon, fallback to Monrovia
                print(f"Geocoding failed for salon {self.name}: {e}")
                self.latitude = 6.315600
                self.longitude = -10.807400

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

class PortfolioItem(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='portfolio_items')
    service = models.ForeignKey('services.Service', on_delete=models.SET_NULL, null=True, blank=True, related_name='portfolio_items')
    title = models.CharField(max_length=255)
    image = models.ImageField(upload_to='portfolio/')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    category = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.service:
            if not self.price:
                self.price = self.service.price
            if not self.title:
                self.title = self.service.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} - {self.salon.name}"
