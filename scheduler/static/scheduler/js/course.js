var Course = Backbone.Model.extend({
    url: function () {
	return "course_details/" + this.get("subject") + "/" + this.get("catalog_number");
    },
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

    initialize: function () {
	this.render();
    },

    render: function () {
	var self = this;
	this.$el.html(this.template(this.model.toJSON()));
	this.$el.click(function () {
	    self.loadDetails();
	});
    },

    loadDetails: function () {
	this.model.fetch();
    }
});

var CourseListView = Backbone.View.extend({
    initialize: function () {
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
	    var courseView = new CourseView({ model: course });
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
