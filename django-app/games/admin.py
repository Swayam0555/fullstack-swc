from django.contrib import admin
from .models import Publisher, Game, GameKey

# Register your models here.
admin.site.register(Publisher)
admin.site.register(Game)
admin.site.register(GameKey)
