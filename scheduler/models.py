from __future__ import unicode_literals

from django.db import models

# Create your models here.
class User(models.Model):
    fb_userid = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    profile_img_url = models.CharField(max_length=500)

    def __str__(self):
	return self.name


class UserShortlistedCourse(models.Model):
    user_id = models.IntegerField()
    class_number = models.IntegerField()
    priority = models.IntegerField(default=0)

    def __str__(self):
	return "User: " + self.user_id + "Class Number:" + self.class_number
