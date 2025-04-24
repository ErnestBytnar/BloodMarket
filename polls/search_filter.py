import django_filters
from .models import BloodOffers


class BloodOffersFilter(django_filters.FilterSet):
    blood_type = django_filters.CharFilter(field_name='blood_type_id__types', lookup_expr='icontains')
    rh_type = django_filters.CharFilter(field_name='blood_type_id__rh_factor', lookup_expr='icontains')
    available = django_filters.BooleanFilter(field_name='available')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')

    class Meta:
        model = BloodOffers
        fields = ['blood_type', 'rh_type', 'available', 'location']
