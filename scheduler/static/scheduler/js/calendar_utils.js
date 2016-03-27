function addEvent($cal, title, start, end, days) {
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
