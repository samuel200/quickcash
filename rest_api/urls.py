from django.urls import path
from .views import *


app_name = 'api'

urlpatterns = [
    path('', index),
    path('login', LoginView.as_view()),
    path('register', RegistrationView.as_view()),
    path('user', UserView.as_view()),
    path('news', NewsView.as_view()),
    path('user/account/', AccountDetailsView.as_view()),
    path('user/change-password/', ChangePasswordView.as_view()),
    path('user/forgot-password/', ForgotPasswordView.as_view()),
    path('user/reset-password/<int:id>/', ResetPasswordView.as_view(), name="reset-password"),
    path('contact/', ContactUsView.as_view()),
]
