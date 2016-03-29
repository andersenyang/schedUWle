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
