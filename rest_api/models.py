from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class UserDetail(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="details")
    referree = models.ForeignKey(User, on_delete=models.CASCADE, related_name="referrals", null=True)
    phone_number = models.CharField(max_length=20)
    game_earnings = models.IntegerField(default=0)
    referral_earnings = models.IntegerField(default=0)
    profile_picture = models.ImageField(upload_to="", null=True)
    account_name = models.CharField(max_length=200, null=True, blank=True)
    bank_name = models.CharField(max_length=200, null=True, blank=True)
    account_number = models.CharField(max_length=50, null=True, blank=True)
    create_date = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.user.username

    @property
    def referral_count(self):
        return self.user.referrals.all().count()

    @property
    def referrals(self):
        return self.user.referrals.all()


class News(models.Model):
    news_type = models.CharField(max_length=100)
    title = models.CharField(max_length=300)
    image_url = models.CharField(max_length=300)
    post_url = models.CharField(max_length=300)
    description = models.TextField()
    published_at = models.DateTimeField()
    source = models.CharField(max_length=200)
    
    def __str__(self):
        return self.title