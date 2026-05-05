import traceback
import os
from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.conf import settings
from django.utils import timezone

def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)

    # Now add the traceback to the response if it's a 500 error
    if response is None or response.status_code == 500:
        tb_list = traceback.format_exception(type(exc), exc, exc.__traceback__)
        tb = "".join(tb_list)

        
        # Log it to a file as well
        log_file = os.path.join(settings.BASE_DIR, "global_errors.log")
        with open(log_file, "a") as f:
            f.write(f"\n--- GLOBAL ERROR AT {timezone.now()} ---\n")
            f.write(f"Context: {context}\n")
            f.write(tb)
            f.write("-------------------------------------\n")

        data = {
            'detail': 'A critical server error occurred.',
            'error_type': exc.__class__.__name__,
            'error_message': str(exc),
            'traceback': tb if settings.DEBUG else 'Traceback hidden in production'
        }
        return Response(data, status=500)

    return response
