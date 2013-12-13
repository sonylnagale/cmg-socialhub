var LF = LF || {};
LF.meta = {};

var doShare = function(el,id) {
	var $ = Livefyre.require('streamhub-sdk/jquery');

	var content = LF.meta[id],
		description = $(".content-body[data-content-id='" + id + "']").text();
	//console.log(description);
	janrain.engage.share.setUrl(content.url);
	janrain.engage.share.setImage(content.image);
	janrain.engage.share.setDescription(description);
	janrain.engage.share.setTitle(content.title)
	janrain.engage.share.show();
	
	janrain.events.onModalClose.addHandler(function(response) {
		janrain.engage.share.reset();
	});
};

(function() {

	var $ = Livefyre.require('streamhub-sdk/jquery');
   
/**
 * lfsocialhub
 * Sets up a three-column social hub experience
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.10
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
	
	// default your reactions
	this.opts.initialMobileCollection = this.opts.collections[2];

	// find mobile default
	for (var collection in this.opts.collections) {
		if (this.opts.collections[collection]['default']) {
			this.opts.initialMobileCollection = this.opts.collections[collection];
		}
	}
	
	this.collections = {};
	this.views = {};
	this.links = [];
	this.isHandheld = false;
	this.isTablet = false;
	
		$(document).ready($.proxy(function() {
		
		this.$el = $(this.opts.el);

		this.$header = $('#socialheader');

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
		if ( navigator.userAgent.match(/iPhone/i) || 
				navigator.userAgent.match(/iPad/i) || 
				(/Android/i.test(navigator.userAgent) && screen.width < 1024)) {
			this.isHandheld = true;
			this.$menu = $($('#socialHub #socialmenu .title')[0]);
			this.$menu.text(this.opts.initialMobileCollection.title);
			$('#socialHub .all').detach();	
		}

		if ( /iPad/i.test(navigator.userAgent) ) {
			this.isTablet = true;
		}
		
		this.$header.originalTop = this.$header.position().top;
		
		
		if (!this.isHandheld && !this.isTablet) { // don't do infinite scroll 

			$(window).scroll($.proxy(function() {
			
			
				var offset = Math.ceil($(window).scrollTop() % $(window).height()/10);
		
				if (offset < 5) {
					for (var view in this.views) {
						this.views[view].showMore(15);
					}
					if (typeof this.wallView != "undefined") {
						this.wallView.showMore(15);
					}
				}
				
			},this));
		}
		
		this._prepData();

	},this));
};

/**
 * @private
 * Prepares the collections and views
 */
LF.lfsocialhub.prototype._prepData = function() {
	
	var ContentListView = Livefyre.require('streamhub-sdk/content/views/content-list-view');
	var Collection = Livefyre.require('streamhub-sdk/collection');
	var inherits = Livefyre.require('inherits');
	
	for (var i = 0; i < this.opts.collections.length; ++i) {
		var collection = this.opts.collections[i];
		
		this.links.push(collection.name); // for the headers
		
		this.collections[collection.name + "Collection"] = new Collection({
			network: collection.network,
			siteId: collection.siteId,
			articleId: collection.articleId
		});
				
		this.views[collection.name + "View"] = new ContentListView({
			initial: 50,
			el: $('#' + collection.name + "Feed")
		});					
		
		var opts = {
				'views': {
					'rss' : true,
					'instagram':true
				}
		};
		
		this.customContent = new LF.lfcustomcontent(opts);
//		console.log(this.customContent,ContentListView);
		inherits(this.customContent,ContentListView);

		this.customContent.hasCustomContentView.call(this.views[collection.name + "View"]);
        
        
        
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
		this.clickEventAll();
	},this));
	
	$("#socialHub #socialmenu .filter").click($.proxy(function(e) {
		this.clickEventIndividual(e);
	},this));
	console.log('handheld',this.isHandheld);
	
	if (this.isHandheld) { // just use the 1-column view
		console.log('clicking');
		this.clickEventIndividual();
	}
};

LF.lfsocialhub.prototype.clickEventAll = function() {
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
};

LF.lfsocialhub.prototype.clickEventIndividual = function(e) {	
	$("#socialHub #socialmenu .title").removeClass('shown');

	$("#socialHub #hub").fadeOut($.proxy(function() {
		this._setWall();
	},this));
	
	for (var key in this.collections) {
		this.collections[key].pause(); // pause the other long polls
	}
			
	this.desiredCollection = (typeof e != 'undefined') ? this.collections[($(e.target).data('source') + "Collection")] : this.collections[this.opts.initialMobileCollection.name + "Collection"];
	this.desiredCollection.resume(); // just start the one we want.
	
	var desiredLink = (!this.isHandheld) ? eval($(e.target).data('source') + "Link") : '#' + this.opts.initialMobileCollection.name + "Link";
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
		this.$menu.text($(desiredLink).innerHTML);
	}

}

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
		
		this.customContent.hasCustomContentView.call(this.wallView);

	},this));
};

})();
