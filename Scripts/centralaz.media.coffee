class Video extends Backbone.Model
	initialize: ->
		@set htmlID: "video_#{@id}"

class VideoCollection extends Backbone.Collection
	initialize: ->
		@model = Video
	comparator: (item) ->
		item.get('id')

class IndexView extends Backbone.View
	constructor: ->
		@container = "#main"
		@indexTemplate = "#vimeo-template"
		super
	render: ->
		$main = $(@container)
		$template = $(@indexTemplate)
		jsonData = @model.toJSON()

		$main.fadeOut "fast", ->
			$main.empty()
			$ul = $("<ul />")
			$template.tmpl(jsonData).appendTo $ul
			$ul.appendTo $main
			$main.fadeIn "fast"

class MessageView extends Backbone.View
	constructor: ->
		@container = "#main"
		@itemTemplate = "#message-template"
		super
	initialize: (options) ->
		@videoEmbed = options.videoEmbed
	render: ->
		$main = $(@container)
		$template = $(@itemTemplate)
		jsonData = @model.toJSON()

		$main.fadeOut "fast", ->
			$main.empty()
			$template.tmpl(jsonData).appendTo $main
			$main.fadeIn "fast"

class MediaApp extends Backbone.Controller
	routes: 
		"": "index" 
		"/home": "index"
		"/message/:id": "message"
		"/latest": "latest"
	initialize: (options) ->
		@message = null
		@currentVideo = null
		@videos = options.collection
		@index = new IndexView model: @videos
		Backbone.history.loadUrl()
	index: ->
		@index.render()
	message: (id) ->
		@currentVideo = @videos.get id
		@message = new MessageView model: @currentVideo
		@message.render()
	latest: ->
		@currentVideo = @videos.at 0
		@message = new MessageView model: @currentVideo
		@message.render()

$(->
	$.getJSON "http://vimeo.com/api/v2/centralaz/videos.json?callback=?", (data) ->
		window.mediaApp = new MediaApp collection: new VideoCollection data
		Backbone.history.start()
)