from django.test import TestCase
from django.contrib.auth.models import User
from polls.models import AccountEvent, UserProfile
from django.utils import timezone


class AccountEventModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_account_event_creation(self):
        event = AccountEvent.objects.create(
            user=self.user,
            event_type='LOGIN_SUCCESS',
            ip_address='127.0.0.1',
            user_agent='TestAgent/1.0',
            success=True,
            details='Successful login test'
        )

        self.assertEqual(event.user.username, 'testuser')
        self.assertEqual(event.event_type, 'LOGIN_SUCCESS')
        self.assertTrue(event.success)
        self.assertEqual(str(event), f"{event.timestamp} | {self.user} | LOGIN_SUCCESS")

    def test_event_without_user(self):
        event = AccountEvent.objects.create(
            event_type='LOGIN_FAIL',
            success=False,
            details='Anonymous failed login'
        )
        self.assertIsNone(event.user)
        self.assertFalse(event.success)


class UserProfileModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='profileuser', password='testpass')

    def test_user_profile_creation(self):
        profile = UserProfile.objects.create(user=self.user)
        self.assertEqual(profile.user.username, 'profileuser')
        self.assertEqual(str(profile), 'profileuser')

    def test_user_profile_path_function(self):
        profile = UserProfile.objects.create(user=self.user)
        path = profile.avatar.field.upload_to(profile, 'avatar.png')
        expected_path = f"user_{self.user.id}/profile/avatar.png"
        self.assertEqual(path, expected_path)
