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
	header: false,
	defaultView: "agendaWeek",
	height: 640,
	columnFormat: "ddd",
	allDaySlot: false,
	minTime: "7:00:00",
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
});
