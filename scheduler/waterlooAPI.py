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
	courses = self._get_courses_from_subject_list(subjects)
	return courses

    def get_course_details(self, subject, catalog_number):
	course = self.helper.course(subject, catalog_number)
	raw_schedules = self.helper.course_schedule(subject, catalog_number)

	schedule = []
	for s in raw_schedules:
	    if len(schedule) < s["associated_class"]:
		section = self._check_section(s)
		schedule.append(section)
	    else:
		section = self._check_section(s, schedule[s["associated_class"]-1])
		schedule[s["associated_class"]-1] = section

	course["schedule"] = schedule
	return course

    def _check_section(self, s, section=None):
	if not section:
	    section = {}

	if "LEC" in s["section"]:
	    section["lec"] = s
	elif "TUT" in s["section"]:
	    section["tut"] = s
	elif "TST" in s["section"]:
	    section["test"] = s
	return section

    def get_class_schedule(self, class_number):
	return self.helper.schedule_by_class_number(class_number)
