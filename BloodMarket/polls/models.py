
from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField

# Create your models here.

class BloodTypes(models.Model):
    blood_types = (("0", "0"), ("A", "A"), ("B", "B"), ("AB", "AB"))
    rh_types = (("Rh +", "Rh +"), ("Rh -", "Rh -"))

    types = models.CharField(choices = blood_types,max_length=2)
    rh_factor = models.CharField(choices= rh_types,max_length=5)

    def __str__(self):
        return f'{self.types} {self.rh_factor}'

class BloodTransaction(models.Model):
    buyer_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    offer_id = models.ForeignKey('BloodOffers', on_delete=models.PROTECT, related_name='transactions')
    total_price = models.FloatField()
    transaction_date = models.DateField()

class BloodOffers(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blood_offers')
    blood_type_id = models.ForeignKey('BloodTypes', on_delete=models.PROTECT, related_name='offers')

    volume_ml = models.IntegerField()
    price_per_100ml = models.IntegerField()
    total_price = models.FloatField()
    avaible = models.BooleanField()
    location = CountryField()
    expires_at = models.DateField()
    created_at = models.DateField()


class BloodDelivery(models.Model):
    pass
    #opcjonalnie