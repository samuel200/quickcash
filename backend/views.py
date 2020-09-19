from django.shortcuts import render, reverse
from django.contrib.auth.decorators import login_required
# fron django.contrib.auth import authenticate, login, logout

# Create your views here.
def home(request):
    return render(request, "index.html")

def reset(request, id):
    return render(request, "index.html")

def referral_signup(request, username):
    return render(request, 'index.html')