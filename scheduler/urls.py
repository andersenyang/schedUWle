from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'timetable$', views.timetable, name='timetable'),
    url(r'course_list$', views.course_list, name='course-list'),
    url(r'course_list/subject/(?P<subject_filter>\w+)$', views.course_list, name='course-list'),
    url(r'course_list/last/(?P<last_subject>\w+)$', views.course_list, name='course-list-subject'),
    url(r'course_list/subject/(?P<subject_filter>\w+)/last/(?P<last_subject>\w+)$', views.course_list, name='course-list'),
    url(r'course_details/(?P<subject>\w+)/(?P<catalog_number>\w+)$', views.course_details, name='course-details'),
    url(r'update_shortlist$', views.save_shortlist, name="save-shortlist"),
    url(r'load_shortlist$', views.get_shortlist, name="get-shortlist")
]
