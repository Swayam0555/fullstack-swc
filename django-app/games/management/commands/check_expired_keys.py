from django.core.management.base import BaseCommand
from django.utils import timezone
from games.models import GameKey
from games.webhooks import send_expiry_webhook


class Command(BaseCommand):
    help = 'Mark active keys whose expiry has passed as expired and notify publishers.'

    def handle(self, *args, **options):
        # select_related fetches publisher details in a single query
        expired_keys = GameKey.objects.select_related('game__publisher').filter(
            expires_at__lte=timezone.now(),
            status='active'
        )
        
        # Convert queryset to list to fetch records before updating status
        keys_to_notify = list(expired_keys)
        
        count = expired_keys.update(status='expired')
        
        for key in keys_to_notify:
            send_expiry_webhook(
                key.game.publisher,
                key.key_string,
                key.game.title,
                key.expires_at
            )
        
        self.stdout.write(self.style.SUCCESS(f'Expired {count} keys (sync webhooks sent).'))
