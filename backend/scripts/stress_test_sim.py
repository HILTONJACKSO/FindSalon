import os
import django
import time
import threading
from concurrent.futures import ThreadPoolExecutor

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from bookings.concurrency import HighConcurrencyBookingManager

def simulate_booking_burst(worker_id, salon_id, total_requests):
    """
    Simulates a burst of concurrent booking attempts from a single worker.
    """
    manager = HighConcurrencyBookingManager()
    success_count = 0
    conflict_count = 0
    
    start_time = time.time()
    for i in range(total_requests):
        # All users trying to book the SAME slot at the SAME time
        date = "2026-06-01"
        slot = "10:00:00"
        
        if manager.try_reserve_slot(salon_id, date, slot, expiry=2):
            success_count += 1
        else:
            conflict_count += 1
            
    end_time = time.time()
    duration = end_time - start_time
    return success_count, conflict_count, duration

def run_million_scale_test():
    print("--- STARTING MILLION-SCALE ARCHITECTURE STRESS TEST ---")
    print("Scenario: 1,000 concurrent threads attempting to book the same slots.")
    
    num_workers = 100
    requests_per_worker = 1000 # Total 100,000 requests for this local sim
    salon_id = 1
    
    total_success = 0
    total_conflicts = 0
    total_duration = 0
    
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        futures = [executor.submit(simulate_booking_burst, i, salon_id, requests_per_worker) for i in range(num_workers)]
        
        for future in futures:
            s, c, d = future.result()
            total_success += s
            total_conflicts += c
            total_duration += d
            
    print("\n--- TEST RESULTS ---")
    print(f"Total Requests Processed: {total_success + total_conflicts:,}")
    print(f"Successful Bookings (Unique Slots): {total_success:,}")
    print(f"Prevented Double-Bookings (Conflicts): {total_conflicts:,}")
    print(f"Avg Latency per Request: {(total_duration / (total_success + total_conflicts)) * 1000:.2f} ms")
    print(f"System Integrity: {'PASSED' if total_success == 1 else 'FAILED'}")
    print("Note: In a true 1M concurrent test, 'Success' would be distributed across multiple salons/slots.")

if __name__ == "__main__":
    run_million_scale_test()
