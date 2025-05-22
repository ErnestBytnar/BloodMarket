
from django.contrib.auth.models import User

from django_countries.fields import CountryField
from django.db import models

# Create your models here.

class AccountEvent(models.Model):
    EVENT_TYPES = [
        ('LOGIN_SUCCESS', 'Login Success'),
        ('LOGIN_FAIL', 'Login Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)
    success = models.BooleanField(default=True)
    details = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.timestamp} | {self.user} | {self.event_type}"


def user_profile_path(instance, filename):
    return f'user_{instance.user.id}/profile/{filename}'

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to=user_profile_path, null=True, blank=True)

    def __str__(self):
        return self.user.username


class BloodTypes(models.Model):
    blood_types = (("0", "0"), ("A", "A"), ("B", "B"), ("AB", "AB"))
    rh_types = (("Rh +", "Rh +"), ("Rh -", "Rh -"))
    types = models.CharField(choices = blood_types,max_length=5)
    rh_factor = models.CharField(choices= rh_types,max_length=5)

    def __str__(self):
        return f'{self.types} {self.rh_factor}'

    class Meta: #
        unique_together = ('types', 'rh_factor')

class BloodTransaction(models.Model):
    buyer_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    offer_id = models.ForeignKey('BloodOffers', on_delete=models.PROTECT, related_name='transactions')
    total_price = models.FloatField()
    transaction_date = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.offer_id and not self.total_price:
            self.total_price = self.offer_id.total_price
        super().save(*args, **kwargs)

class BloodOffers(models.Model):

    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_offers')
    blood_type_id = models.ForeignKey('BloodTypes', on_delete=models.PROTECT, related_name='offers')
    volume_ml = models.IntegerField()
    price_per_100ml = models.IntegerField(null=True, blank=True)
    total_price = models.FloatField()
    available = models.BooleanField(default=True)
    location = CountryField()
    expires_at = models.DateField(null=True, blank=True)
    created_at = models.DateField(auto_now_add=True)
    image = models.ImageField(null=True,blank = True, upload_to="images/")

    def save(self, *args, **kwargs):
        if self.total_price and self.volume_ml:
            self.price_per_100ml = round((self.total_price / self.volume_ml) * 100)
        super().save(*args, **kwargs)


class Message(models.Model):
    sender = models.ForeignKey(User, related_name="sent_messages", on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name="received_messages", on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content[:20]}"

class Chat(models.Model):
    participants = models.ManyToManyField(User, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat {self.id} between {', '.join([user.username for user in self.participants.all()])}"
