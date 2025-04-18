from django.contrib import admin
from .models import BloodTypes,BloodOffers,BloodTransaction

admin.site.register(BloodTypes)
admin.site.register(BloodTransaction)
admin.site.register(BloodOffers)

# Register your models here.
