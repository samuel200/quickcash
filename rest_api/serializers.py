from rest_framework.serializers import ModelSerializer

from django.contrib.auth.models import User
from .models import UserDetail, News, UserTriviaGame, UserSudokuGame

class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email"]


class UserDetailSerializer(ModelSerializer):

    class Meta:
        model = UserDetail
        fields = ['phone_number', 
                  'game_earnings', 
                  'referral_earnings', 
                  'profile_picture', 
                  'account_name', 
                  'bank_name', 
                  'account_number',
                  'referral_count',
                  'create_date',
                  'level']

class NewsSerializer(ModelSerializer):

    class Meta:
        model = News
        fields = ['news_type', 'title', 'image_url', 'post_url', 'description', 'published_at', 'source']

class UserTriviaGameSerializer(ModelSerializer):

    class Meta:
        model = UserTriviaGame
        fields = ['id', 'question', 'options', 'active', 'answered']

class UserSudokuGameSerializer(ModelSerializer):

    class Meta:
        model = UserSudokuGame
        fields = ['id', 'difficulty', 'active', 'answered']