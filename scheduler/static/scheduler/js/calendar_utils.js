function addEvent($cal, options) {
    var eventObject = new Object();

    eventObject.id = options.title;
    eventObject.title = options.title;
    eventObject.start = options.start_time;
    eventObject.end = options.end_time;
    eventObject.dow = options.days;
    eventObject.range = options.range;
    $cal.fullCalendar('renderEvent', eventObject);
}

function removeEvent($cal, id) {
    $cal.fullCalendar('removeEvents', id);
}

function eventInRange($cal, classEvent) {
    var view = $cal.fullCalendar('getView');
    var start = view.start;
    var end = view.end;
    var range = classEvent.range;

    if (!$.isEmptyObject(range)) {
	return (range.start_date.isBefore(end) && range.end_date.isAfter(start));
    }
    return true;
}
