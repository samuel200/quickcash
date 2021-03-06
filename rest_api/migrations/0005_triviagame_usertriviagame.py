# Generated by Django 2.2 on 2020-09-24 11:17

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('rest_api', '0004_news'),
    ]

    operations = [
        migrations.CreateModel(
            name='TriviaGame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('difficulty', models.CharField(max_length=50)),
                ('question', models.TextField()),
                ('answer', models.CharField(max_length=250)),
                ('options', models.TextField()),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserTriviaGame',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('difficulty', models.CharField(max_length=50)),
                ('question', models.TextField()),
                ('answer', models.CharField(max_length=250)),
                ('options', models.TextField()),
                ('active', models.BooleanField(default=True)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trivia_game', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
