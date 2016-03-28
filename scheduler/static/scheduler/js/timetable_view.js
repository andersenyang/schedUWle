var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
	clearTimeout(timer);
	timer = setTimeout(callback, ms);
    };
})();

$(document).ready(function () {
    var $cal = $("#calendar");

    // Render Calendar View
    $cal.fullCalendar({
	header: {
	    left: 'title',
	    center: '',
	    right: 'today prev,next'
	},
	defaultView: "agendaWeek",
	height: 640,
	allDaySlot: false,
	minTime: "7:00:00",
	eventRender: function (event) {
	    return eventInRange($cal, event);
	}
    });

    var courseCollection = new Courses();
    var coursesView = new CourseListView({ collection: courseCollection, $cal: $cal });

    // Fetch list of courses and render the list view
    coursesView.setElement($("#course-list"));
    coursesView.fetchCollection();

    // Bind search input
    var $searchInput = $("#courseSearchInput");
    $searchInput.keyup(function (ev) {
	var keyCode = ev.which;
	if (keyCode == 13) {
	    ev.preventDefault(); 
	} else {
	    var inputArray = $searchInput.val().split(/[0-9]+/);
	    delay(function() {
		coursesView.updateCollectionSubject(inputArray[0]);
		if (inputArray.length > 1) {
		    // this probably won't work yet
		    //coursesView.updateCollectionCatalogNumber(inputArray[1]);
		}
	    }, 500);
	}
    });

    //addEvent($cal, "MTE120", "10:00", "14:00", [0,2,5]);
    //addEvent($cal, "MTE220", "11:00", "15:00", [0,2,5]);
});
