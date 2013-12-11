var LF = LF || {};

(function() {
	
var ListView = Livefyre.require('streamhub-sdk/content/views/content-list-view'),
	ContentView = Livefyre.require('streamhub-sdk/content/views/content-view'),
	Collection = Livefyre.require('streamhub-sdk/collection'),
	Content = Livefyre.require('streamhub-sdk/content'),
	LivefyreContent = Livefyre.require('streamhub-sdk/content/types/livefyre-content'),
	inherits = Livefyre.require('inherits'),
	hogan = Livefyre.require('hogan');

LF.lfcustomcontent = function(opts) {
	this.opts = opts;
	
	this.customViews = {
		'rss': this._rss(),
		'instagram': this._instagram()
	}
	
	if (opts == null) {
		throw "Error: no options defined";
		return;
	}
    inherits(this.CustomContentView, ContentView);

};

/**
 * Identify if we want a custom view
 */
LF.lfcustomcontent.prototype.hasCustomContentView = function(opts) {
	/**
     * Override ListView#createContentView to create a special ContentView
     * class for RSS Items
     */
	
	console.log(opts);
    var ogCreateContentView = this.createContentView;
    this.createContentView = function (content) {
    	console.log(LF.lfcustomcontent.opts);
        if (this.opts[content.source]) {
            return LF.lfcustomcontent.makeCustomContentView(content);
        }
        return ogCreateContentView.apply(this, arguments);
    };
};



/**
 * Create a rendered custom ContentView for the provided content
 */
LF.lfcustomcontent.prototype.makeCustomContentView = function(content) {
    var contentView = new this.CustomContentView({
        content: content
    });
    
    contentView.render();
    
    return contentView;
};


/**
 * A Custom RSS ContentView
 */
LF.lfcustomcontent.prototype.CustomContentView = function (opts) {
	var template = this.customviews[opts.content.source];
	this.custom.compiledTemplate = hogan.compile(template);
	this.custom.source = opts.content.source; 
	
    ContentView.apply(this, arguments);
};

LF.lfcustomcontent.prototype.CustomContentView.prototype.template = function(context) {
//  console.log("Rendering template for custom ContentView", context);
    return this.compiledTemplate.render(context);
};

LF.lfcustomcontent.prototype.CustomContentView.prototype.elClass += ' custom-' + this.customsource + '-content-view';

LF.lfcustomcontent.prototype._rss = function() {
	return '<div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}"/></a>{{/author.avatar}}<div class="content-byline">{{#author.url}}<a class="content-author-name" href="{{author.url}}" target="_blank">{{author.displayName}}</a>{{/author.url}}{{^author.url}}{{#author.profileUrl}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a>{{/author.profileUrl}}{{^author.profileUrl}}<span class="content-author-name">{{author.displayName}}</span>{{/author.profileUrl}}{{/author.url}}</div></div></div><div class="content-attachments"></div><div class="content-body"><a href="{{meta.content.feedEntry.link}}" target="_blank">{{#meta.content.title}}{{{meta.content.title}}}{{/meta.content.title}}{{^meta.content.title}}{{{body}}}{{/meta.content.title}}</a></div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{meta.content.feedEntry.link}}" onClick="doShare(this)" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{{formattedCreatedAt}}}</div>{{/formattedCreatedAt}}</div>';
};

LF.lfcustomcontent.prototype._instagram = function() {
	
};

})();