from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from .models import Publisher, Game


class AuthAndPermissionsTests(APITestCase):
    def setUp(self):
        # Create a test user and a publisher
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
        # Authenticate with token
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_unauthorized_game_modification_blocked(self):
        url = f'/api/games/{self.game1.id}/'
        data = {'title': 'Fortnite Updated', 'price': '9.99', 'publisher': self.publisher1.id}
        # Authenticate with user2's token (not the owner of publisher1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token2.key)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authorized_game_modification_allowed(self):
        url = f'/api/games/{self.game1.id}/'
        data = {'title': 'Fortnite Updated', 'price': '9.99', 'publisher': self.publisher1.id}
        # Authenticate with user1's token (owner of publisher1)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token1.key)
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
