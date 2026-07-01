from django.contrib import admin
from .models import Publisher, Game, GameKey, Order, OrderItem, WebhookDeliveryLog

# Register your models here.
admin.site.register(Publisher)
admin.site.register(Game)
admin.site.register(GameKey)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(WebhookDeliveryLog)
