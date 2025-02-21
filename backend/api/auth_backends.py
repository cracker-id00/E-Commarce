from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailOrPhoneBackend(ModelBackend):
    def authenticate(self, request, email=None, phone_number=None, password=None, **kwargs):
        user = None

        # Try to fetch user by email
        if email:
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return None
        
        # Try to fetch user by phone number
        if phone_number:
            try:
                user = User.objects.get(phone_number=phone_number)
            except User.DoesNotExist:
                return None

        # If user exists, check password
        if user and user.check_password(password):
            return user
        return None
