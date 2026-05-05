from celery import shared_task
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Booking
from customers.models import Customer, CustomerActivity
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

@shared_task
def process_booking_side_effects(booking_id):
    """
    Handles CRM sync, activity logging, and notifications in the background.
    This offloads slow database operations from the main booking request.
    """
    try:
        booking = Booking.objects.select_related('user', 'salon').get(id=booking_id)
        user = booking.user
        
        # 1. Sync with Customer Base (CRM)
        customer, created = Customer.objects.get_or_create(
            salon=booking.salon,
            user=user,
            defaults={
                'first_name': user.first_name or 'New',
                'last_name': user.last_name or 'Client',
                'email': user.email,
                'phone': user.phone,
            }
        )
        
        # 2. Log activity
        if created:
            CustomerActivity.objects.create(
                customer=customer,
                description=f"Initial booking made for {booking.services.first().name if booking.services.exists() else 'Services'}"
            )
        else:
            customer.last_visit = timezone.now()
            customer.save()
            
        # 3. Trigger Notifications (Future)
        # send_booking_notification.delay(booking_id)
        
        logger.info(f"Successfully processed side effects for booking {booking_id}")
        return True
    except Booking.DoesNotExist:
        logger.error(f"Booking {booking_id} not found during side effect processing")
        return False
    except Exception as e:
        logger.error(f"Error processing booking side effects: {e}")
        return False
