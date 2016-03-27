$(document).ready(function () {
    var $cal = $("#calendar");

    $cal.fullCalendar({
	header: false,
	defaultView: "agendaWeek",
	height: 640,
	columnFormat: "ddd",
	allDaySlot: false,
	minTime: "7:00:00",
    });

    courseCollection = new Courses();
    coursesView = new CourseListView({ collection: courseCollection });
    coursesView.setElement($("#course-list"));
    courseCollection.fetchCourses();

    function addEvent(title, start, end, days) {
	var eventObject = new Object();

	eventObject.id = title;
	eventObject.title = title;
	eventObject.start = start;
	eventObject.end = end;
	eventObject.dow = days;
	$cal.fullCalendar('renderEvent', eventObject);
    }

    function removeEvent(id) {
	$cal.fullCalendar('removeEvents', id);
    }
});
