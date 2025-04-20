from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path

from .views import get_user_data,register_user, CustomTokenObtainPairView,test_dummy_home

urlpatterns = [

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/',get_user_data),
    path('register/',register_user,name='register_user'),
    path('',test_dummy_home,name = "home")


]