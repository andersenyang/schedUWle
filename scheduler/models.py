from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class UserShortlistedCourse(models.Model):
    user = models.ForeignKey(User, default=0)
    class_number = models.IntegerField()
    priority = models.IntegerField(default=0)

    def __str__(self):
	return str(self.user_id)

    def toJSON(self):
	return { 
	    "user": self.user.id,
	    "class_number": self.class_number,
	    "priority": self.priority
	}
