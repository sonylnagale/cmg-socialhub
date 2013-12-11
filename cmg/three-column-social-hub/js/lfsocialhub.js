var LF = LF || {};

var doShare = function(data) {
	var $ = Livefyre.require('streamhub-sdk/jquery');
	
	janrain.engage.share.setUrl($(data).data('content-action-share-link'));
	janrain.engage.share.show();
};


(function() {

	var $ = Livefyre.require('streamhub-sdk/jquery');
   
/**
 * lfsocialhub
 * Sets up a three-column social hub experience
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.9
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
	
	// default
	this.opts.initialMobileCollection = this.opts.collections[0];
	
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
	
	this.$el = $(this.opts.el);
	
	this._prepData();

	// cache this dom reference
	
	//now stick our header to the top as we scroll
	$(document).ready($.proxy(function() {
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
	Livefyre.require([
            'streamhub-sdk/content/views/content-list-view',
            'streamhub-sdk/content/views/content-view',
            'streamhub-sdk/collection',
            'streamhub-sdk/content',
            'streamhub-sdk/content/types/livefyre-content',
            'inherits',
            'hogan'
        ],$.proxy(function (ListView, ContentView, Collection, Content, LivefyreContent,
            inherits, hogan) {
		
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
					
		            HasCustomRssContentView.call(this.views[collection.name + "View"]);

		            
		            
		            
					this.collections[collection.name + "Collection"].pipe(this.views[collection.name + "View"]);
				}
			}
			
			this._setEvents();
			
			
			
			
			/**
             * A Custom RSS ContentView
             */
            function CustomRssContentView (opts) {
                ContentView.apply(this, arguments);
            }
            inherits(CustomRssContentView, ContentView);

            CustomRssContentView.prototype.elClass += ' custom-rss-content-view';

            /**
             * It has a custom template, which we've stored in a script element
             * above
             */
            var mustacheTemplate = this._rssMustache(),
                compiledTemplate = hogan.compile(mustacheTemplate);
            CustomRssContentView.prototype.template = function (context) {
                // remove this later, but here you can see what
                // variables you can use in your template
                // meta.content.feedEntry will contain some data
                // from the RSS Feed
                //console.log("Rendering template for custom ContentView", context);

                return compiledTemplate.render(context);
            };
            

            /**
             * Mixin to a ContentListView such that it will render a
             * CustomRssContentView for RSS Content
             */
            function HasCustomRssContentView () {
                /**
                 * Override ListView#createContentView to create a special ContentView
                 * class for RSS Items
                 */
                var ogCreateContentView = this.createContentView;
                this.createContentView = function (content) {
                    if (content.source === 'feed') {
                        return makeCustomContentView(content);
                    }
                    return ogCreateContentView.apply(this, arguments);
                }

                /**
                 * Create a rendered custom ContentView for the provided content
                 */
                function makeCustomContentView (content) {
                    var contentView = new CustomRssContentView({
                        content: content
                    });
                    contentView.render();
                    return contentView;
                }
            }
            
            
            
            
	},this));
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

LF.lfsocialhub.prototype._rssMustache = function() {
	return ' <div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}"/></a>{{/author.avatar}}<div class="content-byline">{{#author.url}}<a class="content-author-name" href="{{author.url}}" target="_blank">{{author.displayName}}</a>{{/author.url}}{{^author.url}}{{#author.profileUrl}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a>{{/author.profileUrl}}{{^author.profileUrl}}<span class="content-author-name">{{author.displayName}}</span>{{/author.profileUrl}}{{/author.url}}</div></div></div><div class="content-attachments"></div><div class="content-body"><a href="{{meta.content.feedEntry.link}}" target="_blank">{{#meta.content.title}}{{{meta.content.title}}}{{/meta.content.title}}{{^meta.content.title}}{{{body}}}{{/meta.content.title}}</a></div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{meta.content.feedEntry.link}}" onClick="doShare(this)" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{{formattedCreatedAt}}}</div>{{/formattedCreatedAt}}</div>';
};

})();
