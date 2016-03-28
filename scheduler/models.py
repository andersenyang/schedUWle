from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserShortlistedCourse(models.Model):
    user_name = models.ForeignKey(User)
    class_number = models.IntegerField()
    priority = models.IntegerField(default=0)

    def __str__(self):
	return "User: " + self.user_id + "Class Number:" + self.class_number
		
	
