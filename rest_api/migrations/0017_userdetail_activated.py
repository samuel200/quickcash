# Generated by Django 2.2 on 2020-11-09 09:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0016_auto_20201107_1655'),
    ]

    operations = [
        migrations.AddField(
            model_name='userdetail',
            name='activated',
            field=models.BooleanField(default=False),
        ),
    ]
