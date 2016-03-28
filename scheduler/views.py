from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from .models import User

from scheduler.waterlooAPI import UWApiHelper

@login_required(login_url="/")
def index(request):
    return timetable(request)


@login_required(login_url="/")
def timetable(request):
    return render(request, 'scheduler/timetable.html')


def course_list(request, last_subject=None, subject_filter=None):
    uwapi = UWApiHelper()
    courses = uwapi.get_course_list(last_subject=last_subject, subject_filter=subject_filter)

    return JsonResponse(courses, safe=False)

def course_details(request, subject, catalog_number):
    uwapi = UWApiHelper()
    course = uwapi.get_course_details(subject, catalog_number)
    return JsonResponse(course)

def login(request):
	if request.user.is_authenticated():
		return redirect('/scheduler')
	else:	
		return render(request, 'scheduler/login.html')

def logout(request):
    auth_logout(request)
    return redirect('/')

