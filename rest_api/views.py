from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMessage
from django.urls import reverse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from .models import UserDetail, News
from .serializers import UserDetailSerializer, UserSerializer, NewsSerializer

import requests

# Create your views here.
@api_view(['GET'])
def index(request):
    return Response(status=200, data={'msg': 'success'})


class LoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except:
            return Response(status=404, data={"error_message": "User with the provided email is not registered on this platform"})

        user = authenticate(username=user.username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response(status=200, data={"msg": "user logged in", "key": token.key})

        return Response(status=401, data={"error_message": "Invalid email or password provided"})


class RegistrationView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        firstname = request.data.get('first_name')
        lastname = request.data.get('last_name')
        username = request.data.get('username')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        referree = None

        try:
            referree = request.data.get('referree')
            print(referree)
        except:
            pass

        try:
            user = User(first_name=firstname,
                        last_name=lastname,
                        username=username,
                        email=email,
                        password=password)
            user.set_password(password)
            user.save()

            if referree:
                try:
                    referree_user = User.objects.get(username=referree)
                    user_detail = UserDetail.objects.create(
                        user=user, referree=referree_user, phone_number=phone_number)

                except:
                    return Response(status=400, data={"error_message": "Invalid referree username"})

            else:
                user_detail = UserDetail.objects.create(
                    user=user, phone_number=phone_number)

        except Exception:
            return Response(status=402, data={"error_message": "Error in registration details"})

        return Response(status=200, data={'msg': "The user has been registered."})


def get_refferal_users(user_queryset):
    user_list = []
    for user in user_queryset:
        current_user = User.objects.get(id=user.user_id)
        current_user_serializer = UserSerializer(current_user)
        current_user_detail_serializer = UserDetailSerializer(user)
        user_list.append({**current_user_serializer.data, **
                          current_user_detail_serializer.data})

    return user_list


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        user_detail = UserDetail.objects.get(user=user)

        user_serializer = UserSerializer(user)
        user_detail_serializer = UserDetailSerializer(user_detail)
        referrals = get_refferal_users(user_detail.referrals)
        return Response(status=200, data={**user_serializer.data, **user_detail_serializer.data, "referrals": referrals})

    def put(self, request):
        user_data = {
            "first_name": request.data.get('firstname'),
            "last_name": request.data.get('lastname'),
            "username": request.data.get('username'),
            "email": request.data.get('email')
        }

        user_detail_data = {
            'phone_number': request.data.get('phone_number')
        }

        user = request.user
        user_detail = UserDetail.objects.get(user=user)

        user_serializer = UserSerializer(user, data=user_data, partial=True)
        user_detail_serializer = UserDetailSerializer(
            user_detail, data=user_detail_data, partial=True)

        if user_serializer.is_valid() and user_detail_serializer.is_valid():
            user_serializer.save()
            user_detail_serializer.save()
            referrals = get_refferal_users(user_detail.referrals)
            return Response(status=200, data={**user_serializer.data, **user_detail_serializer.data, "referrals": referrals})

        else:
            return Response(status=402, data={"error_message": user_serializer.errors})


class AccountDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request):
        user_detail = UserDetail.objects.get(user=request.user)
        serializer = UserDetailSerializer(user_detail, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save();
            # return Response(data=serializer.data, status=201)
            user_data = UserSerializer(request.user).data
            return Response(data={**user_data, **serializer.data}, status=200)

        return Response(status=200)


    def put(self, request):
        user = request.user
        user_detail = UserDetail.objects.get(user=user)

        account_details = {'account_name': request.data.get('account_name'),
                           'bank_name': request.data.get('bank_name'),
                           'account_number': request.data.get('account_number')}

        user_detail_serializer_edit = UserDetailSerializer(
            user_detail, data=account_details, partial=True)

        if user_detail_serializer_edit.is_valid():
            user_detail_serializer_edit.save()
            referrals = get_refferal_users(user_detail.referrals)
            return Response(status=200, data={**(UserSerializer(user).data), **(UserDetailSerializer(user_detail).data), "referrals": referrals})

        else:
            return Response(status=402, data={"error_message": "Error editing account details."})


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        user = request.user

        if user.check_password(old_password):
            if old_password != new_password:
                user.set_password(new_password)
                user.save()
                return Response(status=200, data={'msg': "Password Changed Successfully"})
            else:
                return Response(status=402, data={'error_message': "New Password Can Not Be The Same As The Current"})
        else:
            return Response(status=401, data={'error_message': "Invalid Existing Password Inputted"})


class ForgotPasswordView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
            template = render_to_string('emails/password-reset-email-template.html', {'link': reverse("backend:reset", kwargs={'id': user.id})})

            if user:
                email = EmailMessage(
                    'QuickCash Account Password Reset',
                    template,
                    "<support@quickcash.com>",
                    [email]
                )
                email.content_subtype = "html"
                email.fail_silently = False
                email.send()

        except User.DoesNotExist:
            return Response(status=404)

        return Response({"msg": "Password Reset Request Has Been Sent Succesfully, Check Your Email For Our Response."})


class ResetPasswordView(APIView):
    permission_classes = []
    authentication_classes = []

    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
            password = request.data.get('password')

            if user.check_password(password):
                return Response(status=403, data={'error_message': 'New Password Cannot Be The Same As The Last'})
            else:
                user.set_password(password)

        except:
            return Response(status=404)

        return Response({'msg': 'Password Update Was Successful'})



class NewsView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        news = News.objects.all()
        news_serializer = NewsSerializer(news, many=True)
        return Response(status=200, data=news_serializer.data)

    def post(self, request):
        topic = request.data.get("topic")
        req = requests.get(f"https://newsapi.org/v2/everything?q={topic}&apiKey=dae1f7dba008456a8bf54a246ed98e46")
        
        for data in req.json().get("articles"):
            news = News(news_type=topic, title=data.get("title"), image_url=data.get("urlToImage"),
                        post_url=data.get("url"), description=data.get("description"), published_at=data.get("publishedAt"),
                        source=data["source"].get("name"))
            news.save()

        return Response(status=200, data={"msg": f"{topic} news created and saved"})


class ContactUsView(APIView):


    permission_classes = []
    authentication_classes = []

    def post(self, request):
        try:
            template = render_to_string('emails/contact-us-email-template.html', 
                                        {'name': request.data.get('name'), 
                                        'subject': request.data.get('subject'),
                                        'email': request.data.get('email'),
                                        'message': request.data.get('message')})

            email = EmailMessage(request.data.get('subject'),
                                template, 
                                '<support@quickcash.com>', 
                                [request.data.get('email')])
            
            email.fail_silently = False
            email.send()
            
            return Response(status=200, data={"msg": "email sent successfully"})
        
        except:
            return Response(status=403, data={"error_message": "email failed to send try again later"})