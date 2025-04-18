from django.contrib import admin
from .models import BloodOffers,BloodTransaction,BloodTypes

admin.site.register(BloodTypes)
admin.site.register(BloodTransaction)
admin.site.register(BloodOffers)




