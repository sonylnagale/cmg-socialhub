var LF = LF || {};
LF.meta = {};

var doShare = function(el,id) {
	var $ = Livefyre.require('streamhub-sdk/jquery');

	var content = LF.meta[id],
		description = $(".content-body[data-content-id='" + id + "']").text();
	janrain.engage.share.setUrl(content.url);
	janrain.engage.share.setImage(content.image);
	janrain.engage.share.setDescription(description);
	janrain.engage.share.setTitle(content.title);
	janrain.engage.share.show();
	
	janrain.events.onModalClose.addHandler(function(response) {
		janrain.engage.share.reset();
		
		// since reset doesn't appear to work...
		janrain.engage.share.setUrl(null);
		janrain.engage.share.setImage(null);
		janrain.engage.share.setDescription(null);
		janrain.engage.share.setTitle(null);
	});
};

(function() {

	var $ = Livefyre.require('streamhub-sdk/jquery');
   
/**
 * lfsocialhub
 * Sets up a three-column social hub experience
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.15
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
	var defaults = {
		'infiniteScroll':false
	};
	
	this.opts = $.extend({},  defaults, opts);
	
	
	if (opts == null) {
		throw "Error: no options defined";
		return;
	}
	
	// default your reactions
	this.opts.initialMobileCollection = this.opts.collections[2];
	
	this.collections = {};
	this.views = {};
	this.links = [];
	this.isHandheld = false;
	this.isTablet = false;
	
	$(document).ready($.proxy(function() {
		
		this.$el = $(this.opts.el);

		this.$header = $('#socialheader');

		// sone user-agent detection
		if ( navigator.userAgent.match(/iPhone/i) || 
				navigator.userAgent.match(/iPad/i) || 
				/Android/i.test(navigator.userAgent)) {
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
				
				if (this.opts.infiniteScroll == false) {


					var self = this;
					
					var debouncedScroll = this.debounce($.proxy(function() {
						
						var offset = Math.ceil($(window).scrollTop() % $(window).height()/10);
					
						if (offset < 5) {
							for (var view in self.views) {
								self.views[view].showMore(15);
							}
							if (typeof self.wallView != "undefined") {
								self.wallView.showMore(15);
							}
						}
					},500),self);
					
					debouncedScroll();	
					
					$('.hub-list-more').each($.proxy(function(i,el) {
						var debouncedCheck = this.debounce(function(i,el) {

							var offset = $(el).offset().top - $(window).scrollTop();
							if (offset < $(window).height()) {
								$(el).trigger('click');
							}
							
						},500);

						debouncedCheck(i,el);
					},this));
				} else {

					var offset = Math.ceil($(window).scrollTop() % $(window).height()/10);
			
					if (offset < 5) {
						for (var view in this.views) {
							this.views[view].showMore(15);
						}
						if (typeof this.wallView != "undefined") {
							this.wallView.showMore(15);
						}
					}
				}

			},this));

		} else { // Let's set up the mobile menu now
		
			$("#socialHub #socialmenu").empty();
			
			var menuContainer = $("<div id='mobileMenu'><p>View Only</p></div>").appendTo($("#socialHub #socialmenu"));
			var menu = $("<select id='socialmenu-mobile'>").appendTo($(menuContainer));
			var options = $("<option class='selection' data-source='news'>News &#9660;</option><option class='selection' data-source='experts'>Experts &#9660;</option><option class='selection' data-source='reactions'>Your Reactions &#9660;</option>");
		
			
			$(menu).append($(options));
			
			
			if (this.isTablet) {
				var allMenu = $("<option class='selection' data-source='all' selected>All &#9660;</option>");
				allMenu.prependTo($("#socialmenu-mobile"));
			} else {
				$("#socialmenu-mobile [data-source='reactions']").attr('selected','selected');
			}
			
			var self = this;
			
			$("#socialmenu-mobile").change(function(e) {
				if ($(e.target).find(":selected").val().match(/All/i)) {
					self.clickEventAll();
				} else {
					self.clickEventIndividual($(e.target).find(":selected"));
				}
			});
			
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
			articleId: collection.articleId,
			replies: true 
		});
				
		this.views[collection.name + "View"] = new ContentListView({
			initial: (this.isHandheld) ? 5 : 15,
			showMore: (this.isHandheld) ? 5 : 15,
			el: $('#' + collection.name + "Feed")
		});					

		this.viewopts = {
				'views': {
					'rss' : true,
					'instagram':true,
					'twitter':true
				},
				'sponsor': {
					'author': collection.sponsorHandle,
					'hashtag': collection.sponsorHashtag
				}
		};
		
		
		this.customContent = new LF.lfcustomcontent(opts);

		inherits(this.customContent,ContentListView);
		

		this.customContent.hasCustomContentView.call(this.views[collection.name + "View"], this.viewopts);
                
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
	
	if (this.isHandheld && !this.isTablet) { // just use the 1-column view
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

	if (typeof e != 'undefined') {
		if ($(e).data('source') == 'undefined' || $(e)[0].type == 'click') {
			this.desiredCollection = this.collections[($(e.target).data('source') + "Collection")]; // this came from a standard click
			var desiredLink = eval($(e.target).data('source') + "Link");
		} else {
			this.desiredCollection = this.collections[($(e).data('source') + "Collection")]; // this came from a mobile menu click
			var desiredLink = '#' + $(e).data('source') + "Link";
		}
	} else {
		this.desiredCollection = this.collections[this.opts.initialMobileCollection.name + "Collection"]; // this came from a moble initial load
		var desiredLink = '#' + this.opts.initialMobileCollection.name + "Link";
	}

	this.desiredCollection.resume(); // just start the one we want.
			
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
		
		this.customContent.hasCustomContentView.call(this.wallView, this.viewopts);

	},this));
};

/**
 * Returns a function, that, as long as it continues to be invoked, will not be triggered.
 * The function will be called after it stops being called for N milliseconds.
 * Copied from Underscore.js (MIT License) http://underscorejs.org/docs/underscore.html#section-65
 * @param func {function} The function to debounce
 * @param wait {number} The number of milliseconds to wait for execution of func
 * @param immediate {boolean} trigger the function on the leading edge, instead of the trailing.
 * @return {function} A debounced version of the passed `func`
 */
LF.lfsocialhub.prototype.debounce = function(func, wait, immediate) {
    var timeout, result;
    return function() {
        var context = this,
            args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
            }
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) {
            result = func.apply(context, args);
        }
        return result;
    };
};

})();
