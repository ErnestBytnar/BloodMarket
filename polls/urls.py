from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.urls import path

from .views import get_user_data, register_user, CustomTokenObtainPairView, test_dummy_home, get_data_from_blood_offers, \
    get_data_from_blood_transactions, make_transaction, create_offer, show_blood_types, get_sorted_offers, \
    get_single_offer, get_single_transaction,get_single_blood_type,user_dashboard,user_profile,get_chat_room,get_chat_overview,send_message,create_or_get_private_chat

urlpatterns = [


    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User
    path('user/', get_user_data, name='user-data'),
    path('register/', register_user, name='register_user'),

    # Blood Offers
    path('offers/', get_data_from_blood_offers, name='offer-list'),
    path('offers/<int:pk>/', get_single_offer, name='offer-detail'),
    path('offers/create/', create_offer, name='offer-create'),
    path('offers/sorted/', get_sorted_offers, name='offer-sorted'),

    # Transactions
    path('transactions/', get_data_from_blood_transactions, name='transaction-list'),
    path('transactions/<int:pk>/', get_single_transaction, name='transaction-detail'),
    path('transactions/make/', make_transaction, name='transaction-create'),

    # Blood Types
    path('blood-types/', show_blood_types, name='blood-type-list'),
    #path('user/', user_dashboard, name='user-dashboard'),
    path('profile/', user_profile, name='user_profile'),

    path('chat/<str:room_name>/', get_chat_room, name='chat-room'),
    path('chat/', get_chat_overview, name='get_chat_overview'),
    path('send_message/', send_message, name='send-message'),
    path('privatechat/create_or_get_private_chat/',create_or_get_private_chat,name='get'),
    # Home
    path('', test_dummy_home, name='home'),
]