from django.shortcuts import render
from django.http import HttpResponse, JsonResponse

from .models import User

from scheduler.waterlooAPI import UWApiHelper


def index(request):
    return timetable(request)


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
