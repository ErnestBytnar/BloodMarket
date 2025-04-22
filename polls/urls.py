from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path

from .views import get_user_data,register_user, CustomTokenObtainPairView,test_dummy_home,get_data_from_blood_offers,get_data_from_blood_transactions,make_transaction,create_offer,show_blood_types,get_sorted_offers


urlpatterns = [

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/',get_user_data),
    path('register/',register_user,name='register_user'),
    path('',test_dummy_home,name = "home"),
    path('get_offers/',get_data_from_blood_offers,name="get_data"),
    path('get_transactions/',get_data_from_blood_transactions,name="get_transactions"),
    path('make_transaction/',make_transaction,name="make_transaction"),
    path('create_offer/',create_offer,name="create_offer"),
    path('show_blood_types/',show_blood_types,name="show_blood_types"),
    path('get_sorted_offers/',get_sorted_offers,name="get_sorted_offers")
]