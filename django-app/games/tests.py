from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from django.utils import timezone
from datetime import timedelta
from .models import Publisher, Game, GameKey, Order, OrderItem, WebhookDeliveryLog


class AuthAndPermissionsTests(APITestCase):
    def setUp(self):
        # Create test users and publishers
        self.user1 = User.objects.create_user(username='publisher1', password='password123')
        self.token1 = Token.objects.create(user=self.user1)
        
        self.user2 = User.objects.create_user(username='publisher2', password='password456')
        self.token2 = Token.objects.create(user=self.user2)
        
        self.publisher1 = Publisher.objects.create(
            name="Epic Games",
            webhook_url="https://epic.com/webhook",
            webhook_secret="shh_secret123",
            user=self.user1
        )
        
        self.game1 = Game.objects.create(
            title="Fortnite",
            publisher=self.publisher1,
            price=0.00
        )

    def test_user_registration(self):
        url = '/api/register/'
        data = {'username': 'newuser', 'password': 'newpassword123'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_unauthenticated_game_creation_blocked(self):
        url = '/api/games/'
        data = {'title': 'Unreal Tournament', 'publisher': self.publisher1.id, 'price': '19.99'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authenticated_game_creation_allowed(self):
        url = '/api/games/'
        data = {'title': 'Unreal Tournament', 'publisher': self.publisher1.id, 'price': '19.99'}
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_unauthorized_game_modification_blocked(self):
        url = f'/api/games/{self.game1.id}/'
        data = {'title': 'Fortnite Updated', 'price': '9.99', 'publisher': self.publisher1.id}
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_game_modification_allowed(self):
        url = f'/api/games/{self.game1.id}/'
        data = {'title': 'Fortnite Updated', 'price': '9.99', 'publisher': self.publisher1.id}
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_order_creation_blocked(self):
        url = '/api/orders/'
        data = {'game_id': self.game1.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_order_creation_with_preloaded_key(self):
        # Pre-load an active unowned key
        preloaded_key = GameKey.objects.create(
            key_string="PRELOADED-KEY-1234",
            game=self.game1,
            status='active',
            expires_at=timezone.now() + timedelta(days=10)
        )

        url = '/api/orders/'
        data = {'game_id': self.game1.id}
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['key'], "PRELOADED-KEY-1234")
        self.assertEqual(response.data['game'], self.game1.title)
        
        # Verify database update
        preloaded_key.refresh_from_db()
        self.assertEqual(preloaded_key.owner, self.user1)

    def test_order_creation_without_preloaded_key(self):
        url = '/api/orders/'
        data = {'game_id': self.game1.id}
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data['key'])
        
        # Check generated key exists in database and belongs to user1
        key_in_db = GameKey.objects.get(key_string=response.data['key'])
        self.assertEqual(key_in_db.owner, self.user1)
        self.assertEqual(key_in_db.game, self.game1)


from django.core.management import call_command
from io import StringIO
from unittest import mock


class CheckExpiredKeysCommandTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='publisher_user', password='password123')
        self.publisher = Publisher.objects.create(
            name="Ubisoft",
            webhook_url="https://ubisoft.com/webhook",
            webhook_secret="ubisecret",
            user=self.user
        )
        self.game = Game.objects.create(
            title="Assassin's Creed",
            publisher=self.publisher,
            price=59.99
        )
        # Create an expired active key
        self.key_expired = GameKey.objects.create(
            key_string="EXP-KEY-1",
            game=self.game,
            status='active',
            expires_at=timezone.now() - timedelta(hours=2)
        )
        # Create a non-expired active key
        self.key_active = GameKey.objects.create(
            key_string="ACT-KEY-2",
            game=self.game,
            status='active',
            expires_at=timezone.now() + timedelta(hours=2)
        )

    @mock.patch('requests.post')
    def test_command_expires_past_keys(self, mock_post):
        mock_response = mock.Mock()
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        out = StringIO()
        call_command('check_expired_keys', stdout=out)
        self.assertIn('Expired 1 keys. Webhook tasks dispatched to Celery.', out.getvalue())
        
        self.key_expired.refresh_from_db()
        self.key_active.refresh_from_db()
        
        self.assertEqual(self.key_expired.status, 'expired')
        self.assertEqual(self.key_active.status, 'active')

        # Verify requests.post was called with signature header
        self.assertEqual(mock_post.call_count, 1)
        args, kwargs = mock_post.call_args
        self.assertEqual(args[0], self.publisher.webhook_url)
        self.assertIn('X-Signature', kwargs['headers'])
        self.assertTrue(kwargs['headers']['X-Signature'].startswith('sha256='))

        # Verify WebhookDeliveryLog was created
        self.assertTrue(WebhookDeliveryLog.objects.filter(game_key="EXP-KEY-1", success=True).exists())
