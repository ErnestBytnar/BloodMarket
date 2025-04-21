from django.contrib import admin
from .models import BloodOffers,BloodTransaction,BloodTypes,PrivateMessage

admin.site.register(BloodTypes)
admin.site.register(BloodTransaction)
admin.site.register(BloodOffers)
admin.site.register(PrivateMessage)




