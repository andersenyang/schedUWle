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
	    self.addToTimetable();
	});
	$details.show();
    },

    addToTimetable: function () {
	
    }
});

var CourseListView = Backbone.View.extend({
    initialize: function (options) {
	this.options = options || {};
	this.filterSubject = "";
	this.lastSubject = "";
	this.loadMoreTemplate = _.template($("#load-more-button").html());
	this.listenTo(this.collection, 'fetchEmpty', this.hideLoadMore);
	this.listenTo(this.collection, 'fetchSuccess', this.render);
    },

    render: function () {
	var self = this;
	if (this.reset) {
	    this.$el.html("");
	}

	this.collection.each(function (course) {
	    var courseView = new CourseView({ model: course, $cal: this.options.$cal });
	    this.$el.append(courseView.el);
	}, this);

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
    }
});
