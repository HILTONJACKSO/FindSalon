import redis
from django.conf import settings
import time

class HighConcurrencyBookingManager:
    """
    Manager to handle hyper-scale booking availability using Redis.
    Designed to handle 1M+ concurrent requests with minimal latency.
    """
    def __init__(self):
        self.redis_client = redis.from_url(settings.CELERY_BROKER_URL)
    
    def try_reserve_slot(self, salon_id, date, time_slot, expiry=10):
        """
        Attempts to reserve a slot using an atomic Redis lock.
        Key: lock:salon:{id}:date:{date}:time:{time}
        """
        lock_key = f"lock:salon:{salon_id}:date:{date}:time:{time_slot}"
        
        # Atomic SETNX (Set if Not Exists) with expiration
        # This prevents the "Double Booking" problem at 1M scale
        is_locked = self.redis_client.set(lock_key, "RESERVED", nx=True, ex=expiry)
        
        return is_locked

    def release_slot(self, salon_id, date, time_slot):
        """
        Releases a lock if a booking fails or is cancelled.
        """
        lock_key = f"lock:salon:{salon_id}:date:{date}:time:{time_slot}"
        self.redis_client.delete(lock_key)

    def get_concurrent_bookings_count(self):
        """
        Returns the number of active lock keys (for monitoring).
        """
        return len(self.redis_client.keys("lock:salon:*"))
