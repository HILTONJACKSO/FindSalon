import os
from datetime import datetime
from django.http import JsonResponse
from django.core.cache import cache
from django.conf import settings

class SecurityFortressMiddleware:
    """
    Hyper-Scale Security Middleware (V3 - Resilient):
    1. Resilient Whitelisting
    2. Token-Aware Bypass
    3. Global Rate Limiting
    """
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        try:
            # 0. MEDIA & STATIC BYPASS: Always allow public access to assets
            path = request.path.lower().rstrip('/')
            if path.startswith('/media/') or path.startswith('/static/'):
                return self.get_response(request)

            # 1. HYPER-SCALE BYPASS: Allow public access to discovery and auth
            
            public_paths = [
                '/api/auth/register', '/api/auth/login', '/api/auth/token', 
                '/api/auth/profile', '/api/bookings', '/api/reviews', 
                '/api/salons', '/api/services', '/api/ads', '/api/deals', 
                '/api/categories', '/api/staff'
            ]
            
            # Check if normalized current path starts with any public path
            if any(path.startswith(p.lower()) for p in public_paths):
                return self.get_response(request)

            # 2. TOKEN-AWARE BYPASS: Trust Authorization headers
            auth_header = request.headers.get('Authorization')
            if auth_header and (auth_header.startswith('Bearer ') or auth_header.startswith('Firebase ')):
                return self.get_response(request)
                
            # 3. IP-BASED RATE LIMITING (Only for non-public paths)
            ip = self.get_client_ip(request)
            limit = 1000 
            key = f"ratelimit:{ip}"
            try:
                current = cache.get(key, 0)
                if current >= limit:
                    return JsonResponse({"error": "Rate limit exceeded. Try again in 60s."}, status=429)
                cache.set(key, current + 1, 60)
            except:
                pass # Fail open if cache is down

        except Exception as e:
            return self.get_response(request)

        # 4. FINAL CHALLENGE: If we reach here, it's a non-public path with no token
        return JsonResponse({
            'detail': 'Authentication required.',
            'code': 'unauthorized'
        }, status=401)


    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
