var LF = LF || {};

(function($) {
	
/**
 * lfpopular
 * Finds the given number of Featured items from the given collections
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.3
 * @param {Object} opts = {
 * 		el: String (required)
 * 		collections: Array (required) [ name (String): {
					'network': String,
					'siteId': String,
					'articleId':String
				}
		]
 * 		items: String
 * }
 * @returns {LF.lfpopular} this instance
 */
LF.lfpopular = function(opts) {
	var $ = Livefyre.require('streamhub-sdk/jquery');
	var defaults = {
		'el':null,
		'collections': null,
		'items': 3, // unimplemented; placeholder
		'rotationSpeed' : 5000
	};
	
	this.opts = opts || {};
	this.opts = $.extend(defaults, this.opts);

	// error handling
	if (this.opts.el == null || this.opts.collections == null) {
		throw "Not enough parameters defined";
		return;
	}
	
	this.$el = $(this.opts.el);
	
	this._getFeatured();
};

/**
 * @private
 * Creates collections from opts and gets their featured items 
 */
LF.lfpopular.prototype._getFeatured = function() {
	var collections = [];
	var Collection = Livefyre.require('streamhub-sdk/collection')

	for (var i = 0; i < this.opts.collections.length; ++i) {
		var collection = this.opts.collections[i];
		
		collections.push(new Collection({
			"network":collection.network,
			"siteId":collection.siteId,
			"articleId":collection.articleId
		}).createFeaturedContents().createArchive());
	}
	
	for (var i = 0; i< collections.length; ++i) {
		collections[i].on('data', $.proxy(function(e) {
			this._setContent(e);
		},this));
	}
	
};


/**
 * @private
 * Called by ajax return method from _getContent
 * Actually sets DOM info
 * @param {Object} data
 */
LF.lfpopular.prototype._setContent = function(e) {
	var ListView = Livefyre.require('streamhub-sdk/content/views/content-list-view');
	var ContentView = Livefyre.require('streamhub-sdk/content/views/content-view');
	var Content = Livefyre.require('streamhub-sdk/content');	
					console.log(e.body)
	var div = $('<p/>', {
		id: 'tweet' + e.tweetId,
        html: '<p>' + e.body + '</p><p class="lfTweetIntent"><a class="lf-retweet-action" id="retweet-' + e.tweetId + '">Retweet</a></p>'
	});
	
	this.$el.append(div);
	
	if (e.target.className === "lf-retweet-action") {
	
		$(div).click(function(e) {
			var url = "https://twitter.com/intent/retweet?tweet_id=" + e.target.id.replace('retweet-','');
			window.open(url, 'new',"width=500,height=300,left=" + (screen.width/2) + ",top=" + (screen.height/2));
	
		});
	}
	
	var content = new Content($(div).html());

	
	var contentview = new ContentView({
		content: content, 
		el: document.getElementById('tweet' + e.tweetId)
	}).render();
	
	if (typeof this.timer == 'undefined') {
		this.timer = setInterval($.proxy(function() {
			var item = this.$el.children()[0];
			$(item).fadeOut($.proxy(function() {
				var newitem = $(item).detach().show();
				this.$el.append(newitem);
			},this));
		},this), this.opts.rotationSpeed);
	}
};


})(Livefyre.require('streamhub-sdk/jquery'));
