from django.urls import path
from .views import *

app_name="backend"

urlpatterns = [
    path('', home),
    path('contact', home),
    path('signup', home),
    path('signup/<str:username>', referral_signup),
    path('signin', home, name="signin"),
    path('how-it-works', home),
    path('faq', home),
    path('privacy-policy', home),
    path('dashboard', home),
    path('dashboard/index', home),
    path('dashboard/wallet', home),
    path('dashboard/referrals', home),
    path('dashboard/manage', home),
    path('dashboard/activities', home),
    path('dashboard/game-room', home),
    path('dashboard/game/trivia', home),
    path('dashboard/game/image_puzzle', home),
    path('dashboard/game/sudoku', home),
    path('forgot', home),
    path('reset/<int:id>', reset, name="reset"),
]