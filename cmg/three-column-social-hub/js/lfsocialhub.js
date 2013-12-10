var LF = LF || {};


(function() {

	var $ = Livefyre.require('streamhub-sdk/jquery');

/**
 * lfsocialhub
 * Sets up a three-column social hub experience
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.5
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
	this.isHandheld = false;
	this.isTablet = false;
	
	this.$el = $(this.opts.el);
	
	this._prepData();

	// cache this dom reference
	this.$header = $('#socialheader');
	
	//now stick our header to the top as we scroll
	$(document).ready($.proxy(function() {
		
		// handle ipad hovers 
		
		$("#socialHub #socialmenu li").on("touchstart", function() {
			$("#socialHub #socialmenu ul").show();
			$("#socialHub #socialmenu .title").toggleClass('shown');
		});
	
		$("#socialHub #socialmenu .filter").on("touchend", function(e) {
			e.preventDefault();
			$(e.target).trigger('click');
			$("#socialHub #socialmenu ul").hide();

		});
		
		$("#socialHub #socialmenu .all").on("touchend", function(e) {
			e.preventDefault();
			$(e.target).trigger('click');
			$("#socialHub #socialmenu ul").hide();

		});

		// sone user-agent detection
		if ( /iPhone|iPod/i.test(navigator.userAgent) || (/Android/i.test(navigator.userAgent) && screen.width < 1024)) {
			this.isHandheld = true;
			this.$menu = $($('#socialHub #socialmenu .title')[0]);
			this.$menu.text(this._getCollectionByTitle(this.opts.initialMobileCollection));
			$('#socialHub .all').detach();	
		}

		if ( /iPad/i.test(navigator.userAgent) ) {
			this.isTablet = true;
		}

		
		this.$header.originalTop = this.$header.position().top;
		
		
			$(window).scroll($.proxy(function() {
				
				if (window.pageYOffset >= this.$header.originalTop) {
					this.$header.addClass('scroll');
				} else {
					this.$header.removeClass('scroll');
				}
		
				if (!this.isHandheld && !this.isTablet) { // don't do infinite scroll 

					var offset = Math.ceil($(window).scrollTop() % $(window).height()/10);
		
					if (offset < 5) {
						for (var view in this.views) {
							this.views[view].showMore();
						}
						if (typeof this.wallView != "undefined") {
							this.wallView.showMore();
						}
					}
				}			
			},this));
		
		
		if (this.isHandheld) { // just use the 1-column view
			$("#socialHub #socialmenu .filter[data-source='" + this.opts.initialMobileCollection + "']").trigger("click");
		}
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
				
		if (!this.isHandheld) { // don't do this for handheld since we're going to do a 1-column view
			this.views[collection.name + "View"] = new ListView({
				initial: 50,
				el: $('#' + collection.name + "Feed")
			});
			
			this.collections[collection.name + "Collection"].pipe(this.views[collection.name + "View"]);
		}
	}
	
	this._setEvents();
};

/**
 * @private 
 * Attaches events to the DOM elements.
 */
LF.lfsocialhub.prototype._setEvents = function() {
	$("#socialHub #socialmenu .all").click($.proxy(function() {
		$("#socialHub #socialmenu .title").removeClass('shown');

		$("#socialHub #wall").fadeOut();
		
		for (var key in this.collections) {
			this.collections[key].resume(); // restart the other long polls
		}
		
		for (var i = 0; i < this.links.length; ++i) {
			$('#' + this.links[i] + 'Link').fadeIn().animate({
				width: "31%"
			});
		}
		
		$("#socialHub #hub").fadeIn();
	},this));
	
	$("#socialHub #socialmenu .filter").click($.proxy(function(e){
		$("#socialHub #socialmenu .title").removeClass('shown');

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
					width: "96%"
				});
				$('#' + this.links[i] + 'Link').addClass('only');
			}
		}
		
		if (this.isHandheld) {
			this.$menu.text(this._getCollectionByTitle($(e.target).data('source')));
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

/** @private
 * Small getter for current collection by title
 */
LF.lfsocialhub.prototype._getCollectionByTitle = function(title) {
	for (var collection in this.opts.collections) {
		if (this.opts.collections[collection].name == title) {
			return this.opts.collections[collection].name;
		}		
	}
};

})();