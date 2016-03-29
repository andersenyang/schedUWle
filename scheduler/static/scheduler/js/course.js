function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var Course = Backbone.Model.extend({
    url: function () {
	return "course_details/" + this.get("subject") + "/" + this.get("catalog_number");
    },

    fetchDetails: function () {
	var self = this;
	
	this.fetch({
	    success: function (model, response, options) {
		self.trigger("fetchDetailsSuccess");
	    },
	    error: function (model, response, options) {
		self.trigger("fetchDetailsError");
	    }
	});
    }
})

var Courses = Backbone.Collection.extend({
    model: Course,
    url: 'course_list',

    fetchCourses: function () {
	var self = this;

	this.fetch({
	    reset: true,
	    success: function (collection, response, options) {
		if (response.length == 0) {
		    self.trigger("fetchEmpty");
		} else {
		    self.trigger("fetchSuccess");
		}
	    },
	    error: function (collection, response, options) {
		self.trigger("fetchError");
	    }
	});
    }
});

var CourseView = Backbone.View.extend({
    template: _.template($("#course-template").html()),

    initialize: function (options) {
	this.options = options || {};
	this.render();
	this.detailedViewTemplate = _.template($("#detailed-course-template").html());
	this.listenTo(this.model, "fetchDetailsSuccess", this.renderDetails);
    },

    toggleDetails: function () {
	var $details = this.$el.find(".course-details");
	if ($details.is(":visible")) {
	    $details.hide();
	} else {
	    this.model.fetchDetails();
	}
    },

    render: function () {
	var self = this;
	this.$el.html(this.template(this.model.toJSON()));
	this.$el.find(".course-header").click(function () {
	    self.toggleDetails();
	});
    },

    renderDetails: function () {
	var self = this;
	var $details = this.$el.find(".course-details");

	$details.html(this.detailedViewTemplate(this.model.toJSON()));
	$details.find(".add-course").click(function () {
	    var class_index = this.dataset.index;
	    console.log(self.model.get("schedule")[class_index])
	    self.trigger("courseAdded", self.model.get("schedule")[class_index]);
	});
	$details.show();
    }
});

var EventsCollection = Backbone.Collection.extend({
    initialize: function (options) {
	this.options = options || {};
    },

    getEventList: function () {
	var eventsList = [];
	this.each(function (model) {
	    if (model.attributes.title) {
		eventsList.push(model.attributes);
	    }
	});
	return eventsList;
    },

    getClassNumbers: function () {
	var classNumbers = [];
	this.each(function (model) {
	    if (model.attributes.title) {
		classNumbers.push(model.get("classNumber"));
	    }
	});
	return classNumbers;
    }
})

var CourseListView = Backbone.View.extend({
    initialize: function (options) {
	this.options = options || {};
	this.filterSubject = "";
	this.lastSubject = "";
	this.loadMoreTemplate = _.template($("#load-more-button").html());
	this.classEventsCollection = new EventsCollection({ parentView: this });
	this.listenTo(this.collection, 'fetchEmpty', this.hideLoadMore);
	this.listenTo(this.collection, 'fetchSuccess', this.render);
    },

    render: function () {
	var self = this;
	if (this.reset) {
	    this.$el.html("");
	}

	this.collection.each(function (course) {
	    var options = {
		model: course,
		$cal: self.options.$cal,
		parentView: self
	    }
	    var courseView = new CourseView(options);
	    self.listenTo(courseView, 'courseAdded', self.addCourse);
	    self.$el.append(courseView.el);
	});

	this.$el.append(this.loadMoreTemplate());
	this.$el.find(".load-more").click(function () {
	    self.loadMore();   
	});
	this.updateCollectionLastSubject();
	this.reset = false;
	return this;
    },

    updateCollectionCatalogNumer: function (catalog_number) {
	this.lastSubject = "";
	this.catalogNumber = catalog_number;
	
	//this.reset = true;
	//this.fetchCollection();
    },

    updateCollectionSubject: function (subject) {
	// If the subject has been changed, it is a new search
	this.lastSubject = "";
	this.filterSubject = subject.toUpperCase();

	this.reset = true;
	this.fetchCollection();
    },

    updateCollectionLastSubject: function () {
	var lastCourse = this.collection.at(-1);
	if (lastCourse != undefined) {
	    this.lastSubject = lastCourse.get("subject");
	}
    },

    fetchCollection: function () {
	var url_string = "course_list";
	if (this.filterSubject != "" && this.filterSubject != undefined) {
	    url_string += "/subject/" + this.filterSubject;
	}
	
	if (this.lastSubject != "" && this.lastSubject != undefined) {
	    url_string += "/last/" + this.lastSubject;
	}

	this.collection.url = url_string;
	this.collection.fetchCourses();
    },

    loadMore: function () {
	this.hideLoadMore();
	this.fetchCollection();
    },

    hideLoadMore: function () {
	var $loadMore = this.$el.find(".load-more");
	if ($loadMore != undefined) {
	    $loadMore.remove();
	}
    },

    initialFetch: function () {
	var self = this;
	$.ajax({
	    url: 'load_shortlist',
	    success: function (data) {
		data = $.parseJSON(data);
		//self.loadShortlist(data);
	    }
	});
    },

    loadShortlist: function (data) {
	console.log(shortlist);
    },

    addCourse: function (classModel) {
	if (classModel["lec"]) {
	    this.addToEventList(classModel["lec"]);
	}
	if (classModel["tut"]) {
	    this.addToEventList(classModel["tut"]);
	}
	if (classModel["test"]) {
	    this.addToEventList(classModel["test"]);
	}
	this.updateUserShortlist();
	this.updateCalendar();
    },

    updateUserShortlist: function () {
	var classNumbersList = this.classEventsCollection.getClassNumbers();
	var data = { "class_numbers": JSON.stringify(classNumbersList) };
	$.ajax({
	    method: "POST",
	    url: "update_shortlist",
	    data: data
	});
    },

    addToEventList: function (classDetails) {
	var self = this;

	// parse class schedule and add to eventslist
	_.each(classDetails.classes, function (c) {
	    var classEvent = new Object();
	    var range = {};
	    var class_id = classDetails.class_number + c.date.start_time;

	    if (c.date.start_date && c.date.end_date) {
		var sdate = c.date.start_date.split("/");
		var edate = c.date.end_date.split("/");

		range.start_date = moment().month(sdate[0]).date(sdate[1]);
		range.end_date = moment().month(edate[0]).date(edate[1]);

		class_id = class_id + sdate[0] + "_" + sdate[1];
	    }

	    classEvent.id = class_id;
	    classEvent.title = classDetails.subject + classDetails.catalog_number;
	    classEvent.classNumber = classDetails.class_number;
	    classEvent.start = c.date.start_time;
	    classEvent.end = c.date.end_time;
	    classEvent.dow = self.parseDOW(c.date.weekdays);
	    classEvent.range = range;

	    self.classEventsCollection.add(classEvent);
	});
    },

    parseDOW: function (daysString) {
	var days = daysString.split(/(?=[A-Z]+)/);
	var dow = [];
	_.each(days, function (day) {
	    switch (day) {
		case "M":
		    dow.push(1);
		    break;
		case "T":
		    dow.push(2);
		    break;
		case "W":
		    dow.push(3);
		    break;
		case "Th":
		    dow.push(4);
		    break;
		case "F":
		    dow.push(5);
		    break;
	    }
	});
	return dow;
    },

    updateCalendar: function () {
	var eventsList = this.classEventsCollection.getEventList();

	this.options.$cal.fullCalendar('removeEvents');
	this.options.$cal.fullCalendar('addEventSource', eventsList);
    }
});
