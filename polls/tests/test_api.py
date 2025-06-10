from rest_framework.test import APITestCase, APIClient
from django.urls import reverse
from rest_framework import status
from django.contrib.auth.models import User

from polls.models import BloodTypes, UserProfile


class RegisterUserTest(APITestCase):
    def test_register_user_success(self):
        data = {
            "username": "testuser",
            "password": "TestPass123!",
            "email": "test@example.com"
        }
        response = self.client.post(reverse('register_user'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("message", response.data)

class UserProfileTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.profile = UserProfile.objects.create(user=self.user)
        self.client.login(username='testuser', password='testpass')

    def test_get_user_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('user_profile'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('avatar', response.data)




class CreateOfferTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='offeruser', password='offerpass')
        self.client.login(username='offeruser', password='offerpass')
        self.client.force_authenticate(user=self.user)
        self.blood_type = BloodTypes.objects.create(types='A+', rh_factor='+')

    def test_create_offer_success(self):
        data = {
            "user_id": self.user.id,
            "blood_type_id": self.blood_type.id,
            "volume_ml": 500,
            "total_price": 300.0,
            "location": "PL",
            "image": ""
        }
        response = self.client.post(reverse('offer-create'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("volume_ml"), 500)