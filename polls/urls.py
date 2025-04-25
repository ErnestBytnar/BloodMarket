from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path

from .views import get_user_data, register_user, CustomTokenObtainPairView, test_dummy_home, get_data_from_blood_offers, \
    get_data_from_blood_transactions, make_transaction, create_offer, show_blood_types, get_sorted_offers, \
    get_single_offer, get_single_transaction

urlpatterns = [

    # Authentication
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User
    path('api/user/', get_user_data, name='user-data'),
    path('api/user/register/', register_user, name='register-user'),

    # Blood Offers
    path('api/offers/', get_data_from_blood_offers, name='offer-list'),
    path('api/offers/<int:pk>/', get_single_offer, name='offer-detail'),
    path('api/offers/create/', create_offer, name='offer-create'),
    path('api/offers/sorted/', get_sorted_offers, name='offer-sorted'),

    # Transactions
    path('api/transactions/', get_data_from_blood_transactions, name='transaction-list'),
    path('api/transactions/<int:pk>/', get_single_transaction, name='transaction-detail'),
    path('api/transactions/make/', make_transaction, name='transaction-create'),

    # Blood Types
    path('api/blood-types/', show_blood_types, name='blood-type-list'),

    # Home
    path('', test_dummy_home, name='home'),
]