var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
	clearTimeout(timer);
	timer = setTimeout(callback, ms);
    };
})();

$(document).ready(function () {
    var $cal = $("#calendar");
    var courseCollection = new Courses();
    var coursesView = new CourseListView({ collection: courseCollection });

    // Fetch list of courses and render the list view
    coursesView.setElement($("#course-list"));
    coursesView.fetchCollection();

    // Render Calendar View
    $cal.fullCalendar({
	header: false,
	defaultView: "agendaWeek",
	height: 640,
	columnFormat: "ddd",
	allDaySlot: false,
	minTime: "7:00:00",
    });

    var $searchInput = $("#courseSearchInput");
    $searchInput.keyup(function (ev) {
	var keyCode = ev.which;
	if (keyCode == 13) {
	    ev.preventDefault(); 
	} else {
	    delay(function() {
		coursesView.updateCollectionSubject($searchInput.val());
	    }, 500);
	}
    });

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
