(function () {
    var IndexView, MediaApp, MessageView, Video, VideoCollection;
    var __hasProp = Object.prototype.hasOwnProperty, __extends = function (child, parent) {
        for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor;
        child.__super__ = parent.prototype;
        return child;
    };
    Video = (function () {
        __extends(Video, Backbone.Model);
        function Video() {
            Video.__super__.constructor.apply(this, arguments);
        }
        Video.prototype.initialize = function () {
            return this.set({
                htmlID: "video_" + this.id
            });
        };
        return Video;
    })();
    VideoCollection = (function () {
        __extends(VideoCollection, Backbone.Collection);
        function VideoCollection() {
            VideoCollection.__super__.constructor.apply(this, arguments);
        }
        VideoCollection.prototype.initialize = function () {
            return this.model = Video;
        };
        VideoCollection.prototype.comparator = function (item) {
            return item.get('id');
        };
        return VideoCollection;
    })();
    IndexView = (function () {
        __extends(IndexView, Backbone.View);
        function IndexView() {
            this.container = "#main";
            this.indexTemplate = "#vimeo-template";
            IndexView.__super__.constructor.apply(this, arguments);
        }
        IndexView.prototype.render = function () {
            var $main, $template, jsonData;
            $main = $(this.container);
            $template = $(this.indexTemplate);
            jsonData = this.model.toJSON();
            return $main.fadeOut("fast", function () {
                var $ul;
                $main.empty();
                $ul = $("<ul />");
                $template.tmpl(jsonData).appendTo($ul);
                $ul.appendTo($main);
                return $main.fadeIn("fast");
            });
        };
        return IndexView;
    })();
    MessageView = (function () {
        __extends(MessageView, Backbone.View);
        function MessageView() {
            this.container = "#main";
            this.itemTemplate = "#message-template";
            MessageView.__super__.constructor.apply(this, arguments);
        }
        MessageView.prototype.initialize = function (options) {
            return this.videoEmbed = options.videoEmbed;
        };
        MessageView.prototype.render = function () {
            var $main, $template, jsonData;
            $main = $(this.container);
            $template = $(this.itemTemplate);
            jsonData = this.model.toJSON();
            return $main.fadeOut("fast", function () {
                $main.empty();
                $template.tmpl(jsonData).appendTo($main);
                return $main.fadeIn("fast");
            });
        };
        return MessageView;
    })();
    MediaApp = (function () {
        __extends(MediaApp, Backbone.Controller);
        function MediaApp() {
            MediaApp.__super__.constructor.apply(this, arguments);
        }
        MediaApp.prototype.routes = {
            "": "index",
            "/home": "index",
            "/message/:id": "message",
            "/latest": "latest"
        };
        MediaApp.prototype.initialize = function (options) {
            this.message = null;
            this.currentVideo = null;
            this.videos = options.collection;
            this.index = new IndexView({
                model: this.videos
            });
            return Backbone.history.loadUrl();
        };
        MediaApp.prototype.index = function () {
            return this.index.render();
        };
        MediaApp.prototype.message = function (id) {
            this.currentVideo = this.videos.get(id);
            this.message = new MessageView({
                model: this.currentVideo
            });
            return this.message.render();
        };
        MediaApp.prototype.latest = function () {
            this.currentVideo = this.videos.at(0);
            this.message = new MessageView({
                model: this.currentVideo
            });
            return this.message.render();
        };
        return MediaApp;
    })();
    $(function () {
        return $.getJSON("http://vimeo.com/api/v2/centralaz/videos.json?callback=?", function (data) {
            window.mediaApp = new MediaApp({
                collection: new VideoCollection(data)
            });
            return Backbone.history.start();
        });
    });
}).call(this);
