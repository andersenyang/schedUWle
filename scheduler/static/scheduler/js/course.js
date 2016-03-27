var Course = Backbone.Model.extend({
})

var Courses = Backbone.Collection.extend({
    model: Course,
    url: 'course_list',

    fetchCourses: function () {
	var self = this;

	this.fetch({
	    reset: true,
	    success: function (collection, response, options) {
		self.trigger("fetchSuccess");
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
	this.$el.html(this.template(this.model.toJSON()));
    }
});

var CourseListView = Backbone.View.extend({
    initialize: function () {
	this.listenTo(this.collection, 'fetchSuccess', this.render);
    },

    render: function () {
	this.collection.each(function(course) {
	    var courseView = new CourseView({ model: course });
	    this.$el.append(courseView.el);
	}, this);
    }
});
