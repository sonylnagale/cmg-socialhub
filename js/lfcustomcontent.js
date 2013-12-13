var LF = LF || {};

(function() {
	
var ContentListView = Livefyre.require('streamhub-sdk/content/views/content-list-view'),
	ContentView = Livefyre.require('streamhub-sdk/content/views/content-view'),
	Collection = Livefyre.require('streamhub-sdk/collection'),
	Content = Livefyre.require('streamhub-sdk/content'),
	LivefyreContent = Livefyre.require('streamhub-sdk/content/types/livefyre-content'),
	InstagramContentView = Livefyre.require('streamhub-sdk/content/views/instagram-content-view'),
	ContentViewFactory = Livefyre.require('streamhub-sdk/content/content-view-factory')	
	inherits = Livefyre.require('inherits'),
	TiledAttachmentsListView = Livefyre.require('streamhub-sdk/content/views/tiled-attachment-list-view'),
	hogan = Livefyre.require('hogan');

LF.lfcustomcontent = function(opts) {
	this.custom = {
			'opts':opts
	};
	
	this.customViews = {
		'feed': this.rss(),
		'instagram': this.instagram()
	};
	
	return this;
};


/**
 * Identify if we want a custom view
 */
LF.lfcustomcontent.prototype.hasCustomContentView = function() {
	var opts = {
		'views': {
			'feed' : true,
			'instagram':true,
			'twitter':false,
			'facebook':false
		}
	};
	
	/**
     * Override ListView#createContentView to create a special ContentView
     * class for certain Items
     */
    var ogCreateContentView = this.createContentView;
    
    this.createContentView = function (content) {
    	if (opts.views[content.source] === true) {
    		var customContent = new LF.lfcustomcontent(opts);
    		inherits(customContent.CustomContentView, ContentView);

            return customContent.makeCustomContentView(content,customContent);
        }
        
    	try {
    		return ogCreateContentView.apply(this, arguments);
    	} catch (e) {
    		return;
    	}
    };
};


/**
 * Create a rendered custom ContentView for the provided content
 */
LF.lfcustomcontent.prototype.makeCustomContentView = function(content,self) {
	var template = self.customViews[content.source];
	var compiledTemplate = hogan.compile(template);

	this.CustomContentView.prototype.template = function(context) {
  	    return compiledTemplate.render(context);
  	};

  	this.CustomContentView.prototype.elClass += ' custom-' + content.source + '-content-view';
  	
  	if (content.source == 'instagram') {
  	  	this.CustomContentView.prototype.elClass += ' content-instagram';
  	}
  	
	var contentView = new this.CustomContentView({
        content: content,
        attachmentsView: new TiledAttachmentsListView({ content: content})
    });
    

    contentView.render();
    
    return contentView;
};


/**
 * A Custom RSS ContentView
 */
LF.lfcustomcontent.prototype.CustomContentView = function (opts) {;
	switch(opts.content.source) {
	case 'instagram':
		InstagramContentView.apply(this,arguments);
		break;
	
	case 'feed':
	    ContentView.apply(this, arguments);
		break;
	}
	
};


LF.lfcustomcontent.prototype.rss = function() {
	//return 'rss';
	return ' <script>LF.meta["{{id}}"]={"url": "{{meta.content.feedEntry.link}}", "image": "", "title":"{{meta.content.title}}"};</script><div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}"/></a>{{/author.avatar}}<div class="content-byline">{{#author.url}}<a class="content-author-name" href="{{author.url}}" target="_blank">{{author.displayName}}</a>{{/author.url}}{{^author.url}}{{#author.profileUrl}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a>{{/author.profileUrl}}{{^author.profileUrl}}<span class="content-author-name">{{author.displayName}}</span>{{/author.profileUrl}}{{/author.url}}</div></div></div><div class="content-attachments"></div><div class="content-body" data-content-id="{{id}}"><a href="{{meta.content.feedEntry.link}}" target="_blank">{{#meta.content.title}}{{{meta.content.title}}}{{/meta.content.title}}{{^meta.content.title}}{{{body}}}{{/meta.content.title}}</a></div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{meta.content.feedEntry.link}}" onClick="doShare(this,\'{{id}}\')" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{{formattedCreatedAt}}}</div>{{/formattedCreatedAt}}</div>';
};

LF.lfcustomcontent.prototype.instagram = function() {
	return '<script>LF.meta["{{id}}"]={"url": "{{author.profileUrl}}","image": "{{#attachments}}{{thumbnail_url}}{{/attachments}}","title":"{{meta.content.title}}"};</script><div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}"/></a>{{/author.avatar}}<div class="content-byline"><span class="content-source-logo"></span>{{#author.displayName}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a>{{/author.displayName}}{{^author.displayName}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.id}}</a>{{/author.displayName}}</div></div></div><div class="content-attachments"></div><div class="content-body" data-content-id="{{id}}">{{{body}}}</div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{author.profileUrl}}" onClick="doShare(this,\'{{id}}\')" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{{formattedCreatedAt}}}</div>{{/formattedCreatedAt}}</div>';
};

})();