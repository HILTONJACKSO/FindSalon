
class DisableCSRFMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Hyper-Scale Bypass: Ensure NO API request is ever blocked by CSRF
        if request.path.startswith('/api') or 'api' in request.path:
            setattr(request, '_dont_enforce_csrf_checks', True)
            setattr(request, 'csrf_processing_done', True)
        return self.get_response(request)

