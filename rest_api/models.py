from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
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
    level = models.IntegerField(default=1)
    create_date = models.DateTimeField(auto_now_add=True)
    activated = models.BooleanField(default=False)  

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

class TriviaGame(models.Model):
    difficulty = models.CharField(max_length=50)
    question = models.TextField()
    answer = models.CharField(max_length=250)
    options = models.TextField()
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question

class UserTriviaGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trivia_game")
    difficulty = models.CharField(max_length=50)
    question = models.TextField()
    answer = models.CharField(max_length=250)
    options = models.TextField()
    correct = models.BooleanField(default=False)
    answered = models.BooleanField(default=False)
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class UserSudokuGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sudoku_game")
    difficulty = models.CharField(max_length=50)
    board = models.CharField(max_length=200)
    current_board = models.CharField(max_length=200, default="")
    answered = models.BooleanField(default=False)
    correct = models.BooleanField(default=False)
    time = models.IntegerField(default=1800)
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username
    
    def set_board_value(self, board):
        self.board = board

class ImagePuzzleGame(models.Model):
    difficulty = models.CharField(max_length=50)
    image_url = models.CharField(max_length=300)
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id

class ImagePuzzleGame(models.Model):
    image_url = models.CharField(max_length=300)
    created_date = models.DateTimeField(auto_now_add=True)

class UserImagePuzzleGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="image_puzzle_game")
    image_url = models.CharField(max_length=300)
    correct = models.BooleanField(default=False)
    time = models.IntegerField(default=1800)
    answered = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return  self.user.username

Transaction_Choices = (('withdrawal', 'w'), ('deposit', 'd'))

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transaction")
    trans_type = models.CharField(max_length=10, choices=Transaction_Choices)
    amount = models.FloatField()
    status = models.BooleanField(default=False)
    used = models.BooleanField(default=False)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return  self.user.username


@receiver(post_save, sender=Transaction)
def implement_transaction(sender, instance, created, *args, **kwargs):
    if instance.status == True and not instance.used:
        user_detail = UserDetail.objects.get(user=instance.user)
        if user_detail.activated:
            if instance.trans_type == "deposit":
                user_detail.game_earnings += instance.amount
            else:
                user_detail.game_earnings -= instance.amount
        
        else:
            amount = instance.amount
            if instance.trans_type == "deposit":
                amount -= 1000
                if amount > 0:
                    amount -= user_detail.referral_earnings
                    if amount < 0:
                        user_detail.referral_earnings = -amount
                    else:
                        user_detail.game_earnings -= amount
                referee = UserDetail.objects.get(user=user_detail.referree)
                referee.referral_earnings += 1000
                referee.save()
                user_detail.activated = True

        instance.used = True
        instance.save()
        user_detail.save()

@receiver(post_save, sender=UserDetail)
def implement_referral_earning(sender, instance, created, *args, **kwargs):
    if not instance.activated and instance.referral_earnings >= 1000:
        instance.referral_earnings -= 1000
        instance.activated = True
        instance.save()

            