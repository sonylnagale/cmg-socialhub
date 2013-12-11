var LF = LF || {};

(function() {
	
var ContentListView = Livefyre.require('streamhub-sdk/content/views/content-list-view'),
	ContentView = Livefyre.require('streamhub-sdk/content/views/content-view'),
	Collection = Livefyre.require('streamhub-sdk/collection'),
	Content = Livefyre.require('streamhub-sdk/content'),
	LivefyreContent = Livefyre.require('streamhub-sdk/content/types/livefyre-content'),
	inherits = Livefyre.require('inherits'),
	hogan = Livefyre.require('hogan');

LF.lfcustomcontent = function(opts) {
	this.custom = {
			'opts':opts
	};
	
	var self = this;
	this.customViews = {
		'feed': this.rss(),
		'instagram': this.instagram()
	}
	
//	if (opts == null) {
//		throw "Error: no options defined";
//		return;
//	}
	
	return this;
};


/**
 * Identify if we want a custom view
 */
LF.lfcustomcontent.prototype.hasCustomContentView = function() {
	var opts = {
		'views': {
			'feed' : true
		}
	};
	
	/**
     * Override ListView#createContentView to create a special ContentView
     * class for RSS Items
     */
    var ogCreateContentView = this.createContentView;
    this.createContentView = function (content) {
    	if (opts.views[content.source]) {
    		//console.log(1);
    		var customContent = new LF.lfcustomcontent(opts);
    		inherits(customContent.CustomContentView, ContentView);
            return customContent.makeCustomContentView(content,customContent);
        }
        return ogCreateContentView.apply(this, arguments);
    };
};


/**
 * Create a rendered custom ContentView for the provided content
 */
LF.lfcustomcontent.prototype.makeCustomContentView = function(content,self) {
	var template = self.customViews[content.source];
	var compiledTemplate = hogan.compile(template);
	
	this.CustomContentView.prototype.template = function(context) {
  	  //console.log("Rendering template for custom ContentView", context);
  	    return compiledTemplate.render(context);
  	};
	
	var contentView = new this.CustomContentView({
        content: content,
        opts: self
    });
    
    
    contentView.render();
    
    return contentView;
};


/**
 * A Custom RSS ContentView
 */
LF.lfcustomcontent.prototype.CustomContentView = function (opts) {
	
	
	//opts.custom.source = opts.content.source;
	//console.log(this);

    ContentView.apply(this, arguments);
};



LF.lfcustomcontent.prototype.CustomContentView.prototype.template = function(context) {
  console.log("Rendering template for custom ContentView", context);
    return context.opts.compiledTemplate.render(context);
};

LF.lfcustomcontent.prototype.CustomContentView.prototype.elClass += ' custom-' + this.customsource + '-content-view';

LF.lfcustomcontent.prototype.rss = function() {
	return '<div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}"/></a>{{/author.avatar}}<div class="content-byline">{{#author.url}}<a class="content-author-name" href="{{author.url}}" target="_blank">{{author.displayName}}</a>{{/author.url}}{{^author.url}}{{#author.profileUrl}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a>{{/author.profileUrl}}{{^author.profileUrl}}<span class="content-author-name">{{author.displayName}}</span>{{/author.profileUrl}}{{/author.url}}</div></div></div><div class="content-attachments"></div><div class="content-body"><a href="{{meta.content.feedEntry.link}}" target="_blank">{{#meta.content.title}}{{{meta.content.title}}}{{/meta.content.title}}{{^meta.content.title}}{{{body}}}{{/meta.content.title}}</a></div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{meta.content.feedEntry.link}}" onClick="doShare(this)" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{{formattedCreatedAt}}}</div>{{/formattedCreatedAt}}</div>';
};

LF.lfcustomcontent.prototype.instagram = function() {
	
};

//inherits(LF.lfcustomcontent,ContentListView);

})();