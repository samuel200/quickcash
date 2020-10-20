from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(UserDetail)
admin.site.register(News)
admin.site.register(TriviaGame)
admin.site.register(UserTriviaGame)
admin.site.register(UserSudokuGame)