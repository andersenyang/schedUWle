from uwaterlooapi import UWaterlooAPI

class UWApiHelper:
    def __init__(self):
	self.helper = UWaterlooAPI(api_key='72cd7786e5099f6a83182992583cd1f5')

    def _get_subjects(self):
	return [sub["subject"] for sub in self.helper.subject_codes()]

    def _get_courses_from_subject_list(self, subjects):
	courses = []
	for sub in subjects:
	    subject_courses = self.helper.courses(sub)
	    courses = courses + subject_courses

	return courses

    def get_full_course_list(self):
	subjects = self._get_subjects()
	return self._get_courses_from_subject_list(subjects)

    def _filtered_subjects(self, subject_filter=None, last_subject=None):
	subjects = self._get_subjects()
	if subject_filter:
	    subjects = [subject for subject in subjects if subject_filter in subject]
	if last_subject:
	    index = subjects.index(last_subject)
	    subjects = subjects[index+1:]
	if len(subjects) > 3:
	    subjects = subjects[:3]
	return subjects

    def get_course_list(self, subject_filter=None, last_subject=None):
	subjects = self._filtered_subjects(subject_filter=subject_filter, last_subject=last_subject)
	return self._get_courses_from_subject_list(subjects)

    def get_course_details(self, subject, catalog_number):
	course = self.helper.course(subject, catalog_number)
	return course
