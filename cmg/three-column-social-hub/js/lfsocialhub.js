var LF = LF || {};


(function() {

	var $ = Livefyre.require('streamhub-sdk/jquery');

/**
 * lfsocialhub
 * Sets up a three-column social hub experience
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.2
 * @param {Object} opts = {
 * 		el: String (required)
 * 		collections: Array (required) [ name (String): {
					'network': String,
					'siteId': String,
					'articleId':String
				}
		]
 * }
 * @returns {LF.lfsocialhub} this instance
 */	
LF.lfsocialhub = function(opts) {
	
	this.opts = opts;
	
	if (opts == null) {
		throw "Error: no options defined";
		return;
	}
	
	this.collections = {};
	this.views = {};
	this.links = [];
	
	this.$el = $(this.opts.el);
	
	this._prepData();

	// cache this dom reference
	this.$header = $('#socialheader');
	
	//now stick our header to the top as we scroll
	$(document).ready($.proxy(function() {
		this.$header.originalTop = this.$header.position().top;
		
		$(window).scroll($.proxy(function() {
			if ($(window).scrollTop() >= this.$header.originalTop) {
				this.$header.addClass('scroll');
			} else {
				this.$header.removeClass('scroll');
			}
			
			var offset = Math.ceil($(window).scrollTop() % $(window).height()/10);
			console.log(offset);
			if (offset < 5) {
				for (var view in this.views) {
					this.views[view].showMore();
				}
				if (typeof this.wallView != "undefined") {
					this.wallView.showMore();
				}
			}
			
		},this));
	},this));
	
};
	
/**
 * @private
 * Prepares the collections and views
 */
LF.lfsocialhub.prototype._prepData = function() {
	var ListView = Livefyre.require('streamhub-sdk/content/views/content-list-view');
	var Collection = Livefyre.require('streamhub-sdk/collection');
	
	
	for (var i = 0; i < this.opts.collections.length; ++i) {
		var collection = this.opts.collections[i];
		
		this.links.push(collection.name); // for the headers
		
		this.collections[collection.name + "Collection"] = new Collection({
			network: collection.network,
			siteId: collection.siteId,
			articleId: collection.articleId
		});
				
		this.views[collection.name + "View"] = new ListView({
			initial: 50,
			el: $('#' + collection.name + "Feed")
		});
		
		this.collections[collection.name + "Collection"].pipe(this.views[collection.name + "View"]);
	}
	
	this._setEvents();
};

/**
 * @private 
 * Attaches events to the DOM elements.
 */
LF.lfsocialhub.prototype._setEvents = function() {
	$("#socialHub #socialmenu .all").click($.proxy(function() {
		$("#socialHub #wall").fadeOut();
		
		for (var key in this.collections) {
			this.collections[key].resume(); // restart the other long polls
		}
		
		for (var i = 0; i < this.links.length; ++i) {
			$('#' + this.links[i] + 'Link').fadeIn().animate({
				width: "342"
			});
		}
		
		$("#socialHub #hub").fadeIn();
	},this));
	
	$("#socialHub #socialmenu .filter").click($.proxy(function(e){
		$("#socialHub #hub").fadeOut($.proxy(function() {
			this._setWall();
		},this));
		
		for (var key in this.collections) {
			this.collections[key].pause(); // pause the other long polls
		}
				
		this.desiredCollection = this.collections[($(e.target).data('source') + "Collection")];
		this.desiredCollection.resume(); // just start the one we want.
		
		var desiredLink = eval($(e.target).data('source') + "Link");
		for (var i = 0; i < this.links.length; ++i) {					
			
			if (this.links[i] != $(desiredLink).attr('id').replace('Link','')) {
				$('#' + this.links[i] + 'Link').fadeOut(250);
				$('#' + this.links[i] + 'Link').removeClass('only');

			} else {
				$('#' + this.links[i] + 'Link').delay(500).fadeIn().animate({
					width: "1030"
				});
				$('#' + this.links[i] + 'Link').addClass('only');
			}
		}
	},this));
};

/**
 * @private
 * Set up the wall with its proper content
 */
LF.lfsocialhub.prototype._setWall = function() {
	this.$el.fadeOut($.proxy(function() {
		this.$el.fadeIn();

		// prep our wall view
		var WallView = Livefyre.require('streamhub-wall');
		
		this.wallView = new WallView({
		    el: this.$el
		});
		this.desiredCollection.pipe(this.wallView);
	},this));
};
})();
