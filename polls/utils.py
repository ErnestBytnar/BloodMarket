
from django.utils.timezone import now

from polls.models import AccountEvent


def log_account_event(request, event_type, user=None, success=True, details=None):
    ip = request.META.get('HTTP_X_FORWARDED_FOR')
    if ip:
        ip = ip.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')

    user_agent = request.META.get('HTTP_USER_AGENT', '')

    AccountEvent.objects.create(
        user=user,
        event_type=event_type,
        ip_address=ip,
        user_agent=user_agent,
        success=success,
        details=details
    )