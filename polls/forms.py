from django.forms import Form,ModelForm
from .models import BloodOffers,BloodTypes,BloodTransaction

class BloodOffersForm(ModelForm):
    class Meta:
        model = BloodOffers
        fields =['user_id','blood_type_id','volume_ml','total_price','location']

class TypesForm(ModelForm):
    class Meta:
        model = BloodTypes
        fields ='__all__'

class TransactionForm(ModelForm):
    class Meta:
        model = BloodTransaction
        fields = ['buyer_id','offer_id']