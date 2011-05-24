/// <reference path="jquery-1.6-vsdoc.js" />
/// <reference path="jQuery.tmpl.js" />
/// <reference path="underscore.js" />
/// <reference path="backbone.js" />

(function () {
    // Video model class declaration
    var Video = Backbone.Model.extend({
        initialize: function () {
            this.set({ htmlID: "video_" + this.id });
        }
    });

    // Custom collection class declaration (e.g. - public class VideoCollection : List<Video>)
    var VideoCollection = Backbone.Collection.extend({
        // Typing collection to model
        model: Video,

        // Allows Backbone collection implementation to keep videos ordered, etc
        comparator: function (item) {
            return item.get('id');
        }
    });

    // Index view class declaration
    var IndexView = Backbone.View.extend({
        // Private variables
        _container: "#main",
        _indexTemplate: "#vimeo-template",

        // Constructor
        initialize: function (options) { },

        // Views know how to render themselves. I've chosen to use jQuery.tmpl over underscore here...
        render: function () {
            var $main = $(this._container);
            var $template = $(this._indexTemplate);
            var jsonData = this.model.toJSON();

            $main.fadeOut("fast", function () {
                $main.empty();
                var $ul = $("<ul></ul>");
                $template.tmpl(jsonData).appendTo($ul);
                $ul.appendTo($main);
                $main.fadeIn("fast");
            });

            return this;
        }
    });

    // Message view class declaration
    var MessageView = Backbone.View.extend({
        _container: "#main",
        _itemTemplate: "#message-template",
        initialize: function (options) {
            this.videoEmbed = options.videoEmbed
        },
        render: function () {
            var $main = $(this._container);
            var $template = $(this._itemTemplate);
            var jsonData = this.model.toJSON();

            $main.fadeOut("fast", function () {
                $main.empty();
                $template.tmpl(jsonData).appendTo($main);
                $main.fadeIn("fast");
            });

            return this;
        }
    });

    // Controller class declaration
    var MediaApp = Backbone.Controller.extend({
        // Private members to hold view instances
        _index: null,
        _message: null,

        // Data containers
        _data: null,
        _apiUrl: "http://vimeo.com/api/v2/centralaz/videos.json?callback=?",

        // Model object instances
        _videos: null,
        _currentVideo: null,

        // Route table
        routes: {
            "": "index",
            "home": "index",
            "message/:id": "message",
            "latest": "latest"
        },

        // Controller constructor
        initialize: function (options) {
            var controller = this;

            if (this._videos === null) {
                $.getJSON(this._apiUrl, function (data) {
                    controller._data = data;
                    controller._videos = new VideoCollection(data);
                    controller._index = new IndexView({ model: controller._videos });
                    Backbone.history.loadUrl();
                });

                return this;
            }

            return this;
        },

        // Index action (default view)
        index: function () {
            if (this._index !== null) {
                this._index.render();
            }
        },

        // Message action (#message/{id})
        message: function (id) {
            if (this._videos !== null) {
                this._currentVideo = this._videos.get(id);
                this._message = new MessageView({ model: this._currentVideo });
                this._message.render();
            }
        },

        // Action to get the latest video (#latest)
        latest: function () {
            if (this._videos !== null) {
                this._currentVideo = this._videos.at(0);
                this._message = new MessageView({ model: this._currentVideo });
                this._message.render();
            }
        }
    });

    // Register instance of controller globally
    window.mediaApp = new MediaApp();

    // Backbone's magical/revolutionary history recording
    Backbone.history.start();
})();


/* sample json item from Vimeo Simple API
{
	"id":"23504350",
	"title":"The Legacy of Words",
	"description":"A Message by Lisa Jernigan",
	"url":"http:\/\/vimeo.com\/23504350",
	"upload_date":"2011-05-09 18:00:06",
	"mobile_url":"http:\/\/vimeo.com\/m\/#\/23504350",
	"thumbnail_small":"http:\/\/b.vimeocdn.com\/ts\/153\/079\/153079137_100.jpg",
	"thumbnail_medium":"http:\/\/b.vimeocdn.com\/ts\/153\/079\/153079137_200.jpg",
	"thumbnail_large":"http:\/\/b.vimeocdn.com\/ts\/153\/079\/153079137_640.jpg",
	"user_name":"Central Christian",
	"user_url":"http:\/\/vimeo.com\/centralaz",
	"user_portrait_small":"http:\/\/b.vimeocdn.com\/ps\/165\/692\/1656923_30.jpg",
	"user_portrait_medium":"http:\/\/b.vimeocdn.com\/ps\/165\/692\/1656923_75.jpg",
	"user_portrait_large":"http:\/\/b.vimeocdn.com\/ps\/165\/692\/1656923_100.jpg",
	"user_portrait_huge":"http:\/\/b.vimeocdn.com\/ps\/165\/692\/1656923_300.jpg",
	"stats_number_of_likes":"0",
	"stats_number_of_plays":"0",
	"stats_number_of_comments":0,
	"duration":"2315",
	"width":"640",
	"height":"360",
	"tags":""
}
*/