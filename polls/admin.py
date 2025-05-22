from django.contrib import admin
from .models import BloodOffers,BloodTransaction,BloodTypes,Message

admin.site.register(BloodTypes)
admin.site.register(BloodTransaction)
admin.site.register(BloodOffers)
#admin.site.register(Conversation)
admin.site.register(Message)



