# -*- coding: utf-8 -*-
# Generated by Django 1.9.4 on 2016-03-29 01:58
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('scheduler', '0004_remove_usershortlistedcourse_user_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='usershortlistedcourse',
            name='user',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]