import requests
import uuid
import base64
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class MomoClient:
    """
    MTN Mobile Money API Client (Liberia Lonestar Cell)
    Documentation: https://momodeveloper.mtn.com/
    """
    def __init__(self):
        # Default to sandbox if settings are missing
        self.base_url = getattr(settings, 'MOMO_BASE_URL', 'https://sandbox.momodeveloper.mtn.com')
        self.subscription_key = getattr(settings, 'MOMO_SUBSCRIPTION_KEY', '7b4e9e8f4f5a4a4b8a4f4f4f4f4f4f4f') # Placeholder
        self.user_id = getattr(settings, 'MOMO_USER_ID', str(uuid.uuid4()))
        self.api_key = getattr(settings, 'MOMO_API_KEY', 'placeholder_key')
        self.target_env = getattr(settings, 'MOMO_TARGET_ENV', 'sandbox') # 'mtnliberia' for production

    def _get_auth_header(self):
        auth_str = f"{self.user_id}:{self.api_key}"
        encoded_auth = base64.b64encode(auth_str.encode()).decode()
        return f"Basic {encoded_auth}"

    def get_token(self):
        """Generates an OAuth 2.0 access token."""
        url = f"{self.base_url}/collection/token/"
        headers = {
            'Ocp-Apim-Subscription-Key': self.subscription_key,
            'Authorization': self._get_auth_header()
        }
        try:
            # Note: Sandbox might not require the real user_id/api_key if not provisioned
            # For simulation/sandbox, we often use pre-provisioned ones or a fake response
            if self.target_env == 'sandbox' and self.api_key == 'placeholder_key':
                return "sandbox_token_12345"
            
            response = requests.post(url, headers=headers)
            response.raise_for_status()
            return response.json().get('access_token')
        except Exception as e:
            logger.error(f"MoMo Token Generation Failed: {e}")
            return None

    def request_to_pay(self, amount, phone, external_id, payee_note="Subscription"):
        """
        Initiates a payment request (Prompt on user's phone).
        X-Reference-Id must be a UUID v4.
        """
        ref_id = str(uuid.uuid4())
        token = self.get_token()
        if not token:
            return None, "Authentication failed"

        url = f"{self.base_url}/collection/v1_0/requesttopay"
        headers = {
            'Authorization': f'Bearer {token}',
            'X-Reference-Id': ref_id,
            'X-Target-Environment': self.target_env,
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': self.subscription_key,
        }
        
        payload = {
            "amount": str(amount),
            "currency": "LRD", # Liberia uses LRD or USD, usually LRD for MoMo
            "externalId": external_id,
            "payer": {
                "partyIdType": "MSISDN",
                "partyId": phone
            },
            "payerMessage": f"Payment for {payee_note}",
            "payeeNote": payee_note
        }

        try:
            if self.target_env == 'sandbox' and self.api_key == 'placeholder_key':
                logger.info(f"SIMULATED MoMo Request to Pay: {ref_id} for {amount} to {phone}")
                return ref_id, "PENDING"

            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status() # 202 Accepted
            return ref_id, "PENDING"
        except Exception as e:
            logger.error(f"MoMo Request to Pay Failed: {e}")
            return None, str(e)

    def get_payment_status(self, ref_id):
        """Checks the status of a payment request."""
        token = self.get_token()
        if not token:
            return "FAILED"

        url = f"{self.base_url}/collection/v1_0/requesttopay/{ref_id}"
        headers = {
            'Authorization': f'Bearer {token}',
            'X-Target-Environment': self.target_env,
            'Ocp-Apim-Subscription-Key': self.subscription_key,
        }

        try:
            if self.target_env == 'sandbox' and self.api_key == 'placeholder_key':
                # Simulation: Return SUCCESS automatically for testing
                return "SUCCESSFUL"

            response = requests.get(url, headers=headers)
            response.raise_for_status()
            data = response.json()
            # MoMo statuses: PENDING, SUCCESSFUL, FAILED
            return data.get('status')
        except Exception as e:
            logger.error(f"MoMo Status Check Failed: {e}")
            return "FAILED"

def calculate_booking_pricing(salon_base_price):
    """
    Calculates the new FindSalon pricing logic:
    - 7% discount on the original salon price.
    - 4% FindSalon service fee (paid online).
    - Remaining balance paid at the salon.
    """
    from decimal import Decimal
    
    # Ensure we're working with Decimals for financial precision
    salon_base_price = Decimal(str(salon_base_price))
    
    # 1. Calculate 7% discount
    discount = salon_base_price * Decimal('0.07')
    
    # 2. Discounted Salon Price
    discounted_salon_price = salon_base_price - discount
    
    # 3. Service Fee (4% of original price)
    service_fee = salon_base_price * Decimal('0.04')
    
    # 4. Total Price (Discounted + Service Fee)
    total_price = discounted_salon_price + service_fee
    
    # 5. Split payment: Service Fee is paid online, Discounted price is paid at the salon
    pay_now = service_fee
    pay_at_salon = discounted_salon_price
    
    # Salon wallet credit is 0 for the online payment part since FindSalon keeps the service fee.
    # The salon gets the full pay_at_salon amount in person.
    salon_wallet_credit = Decimal('0.00')
    
    return {
        "original_price": round(salon_base_price, 2),
        "discount": round(discount, 2),
        "discounted_salon_price": round(discounted_salon_price, 2),
        "service_fee": round(service_fee, 2),
        "total_price": round(total_price, 2),
        "pay_now": round(pay_now, 2),
        "pay_at_salon": round(pay_at_salon, 2),
        "salon_wallet_credit": round(salon_wallet_credit, 2)
    }
