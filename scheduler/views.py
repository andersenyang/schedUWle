import json

from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from .models import UserShortlistedCourse

from scheduler.waterlooAPI import UWApiHelper

@login_required(login_url="/")
def index(request):
    return timetable(request)


@login_required(login_url="/")
def timetable(request):
    return render(request, 'scheduler/timetable.html')


@login_required(login_url="/")
def save_shortlist(request):
    user = request.user._wrapped if hasattr(request.user,'_wrapped') else request.user
    if request.method == "POST":
	if request.POST.get("class_numbers"):
	    classNumbers = json.loads(request.POST.get("class_numbers"))

	    for uc in UserShortlistedCourse.objects.filter(user_id=user.id):
		if uc.class_number not in classNumbers:
		    # remove model from db if it is not in the list
		    uc.delete()
		else:
		    # remove number from list if it already exists in the db
		    classNumbers = [num for num in classNumbers if num != uc.class_number]

	    for num in classNumbers:
		uc = UserShortlistedCourse(user_id=user.id, class_number=num)
		uc.save()
    
    response = "empty"
    qs  = UserShortlistedCourse.objects.filter(user_id=user.id)
    if qs:
	response = [uc.toJSON() for uc in qs]

    return JsonResponse(response, safe=False)


@login_required(login_url="/")
def get_shortlist(request):
    user = request.user._wrapped if hasattr(request.user,'_wrapped') else request.user
    uwapi = UWApiHelper()

    qs = UserShortlistedCourse.objects.filter(user_id=user.id)
    course_shortlist = [uwapi.get_class_schedule(uc.class_number) for uc in qs]

    return JsonResponse(course_shortlist, safe=False)
	

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
