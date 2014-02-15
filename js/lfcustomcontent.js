var LF = LF || {};

(function() {
	
var ContentView = Livefyre.require('streamhub-sdk/content/views/content-view'),
	InstagramContentView = Livefyre.require('streamhub-sdk/content/views/instagram-content-view'),
	TwitterContentView = Livefyre.require('streamhub-sdk/content/views/twitter-content-view'),
	FacebookContentView = Livefyre.require('streamhub-sdk/content/views/facebook-content-view'),
	inherits = Livefyre.require('inherits'),
	TiledAttachmentsListView = Livefyre.require('streamhub-sdk/content/views/tiled-attachment-list-view'),
	hogan = Livefyre.require('hogan');

LF.lfcustomcontent = function(opts) {
	this.custom = {
			'opts':opts
	};
	
	this.customViews = {
		'feed': this.rss(),
		'instagram': this.instagram(),
		'twitter': this.twitter(),
		'facebook': this.facebook()
	};
	
	return this;
};


/**
 * Identify if we want a custom view
 */
LF.lfcustomcontent.prototype.hasCustomContentView = function(opts) {

	/**
     * Override ListView#createContentView to create a special ContentView
     * class for certain Items
     */
    var ogCreateContentView = this.createContentView;
    
    this.createContentView = function (content) {
    	if (opts.views[content.source] === true) {
    		var customContent = new LF.lfcustomcontent(opts);
    		inherits(customContent.CustomContentView, ContentView);

            return customContent.makeCustomContentView(content,customContent, opts);
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
LF.lfcustomcontent.prototype.makeCustomContentView = function(content,self, opts) {
	var template = self.customViews[content.source];
	var compiledTemplate = hogan.compile(template);

	this.CustomContentView.prototype.template = function(context) {
  	    return compiledTemplate.render(context);
  	};

  	this.CustomContentView.prototype.elClass += ' custom-' + content.source + '-content-view';
  	
  	if (content.source == 'instagram') {
  	  	this.CustomContentView.prototype.elClass += ' content-instagram';
  	}
  	
  	if (content.source == 'twitter') {
  		

  		var twitterUsername = content.author.profileUrl.split('/').pop();
  		if (twitterUsername == opts.sponsor.author) {
  			var isSponsored = 1;
  			
  			if (opts.sponsor.hashtag != '' && opts.sponsor.hashtag != undefined) {
  				if (content.body.indexOf(opts.sponsor.hashtag) == -1) {
  					isSponsored = 0;
  				}
  			}
  			
  			if (isSponsored) {
  	  			content.sponsored = opts.sponsor.author;
  	  			this.CustomContentView.prototype.elClass += ' sponsored-content sponsored-content-author-' + opts.sponsor.author;

  			}
  	  	} 
  	  		
  	  	this.CustomContentView.prototype.elClass += ' content-tweet';
  	  	this.CustomContentView.prototype.getTemplateContext = function () {
        	var context = ContentView.prototype.getTemplateContext.call(this);
        	
        	try {
        		context.author.twitterUsername = context.author.profileUrl.split('/').pop();
        	} catch(e) {
        		return false;
        	}
        	return context;
  	  	};
  	}
  	
  	if (content.source == 'facebook') {
  	  	this.CustomContentView.prototype.elClass += ' content-facebook';
  	  	this.CustomContentView.prototype.getTemplateContext = function () {
	  		var context = ContentView.prototype.getTemplateContext.call(this);
	        if (context.attachments.length) {
	            context.permalink = context.attachments[0].url;
	        }
	        return context;
	    };
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
	case 'twitter':
		TwitterContentView.apply(this, arguments);
		break;
	case 'facebook':
		FacebookContentView.apply(this,arguments);
		break;
	}
	
};


LF.lfcustomcontent.prototype.rss = function() {
	return '<script>LF.meta["{{id}}"]={"url": "{{meta.content.feedEntry.link}}", "image": "", "title":"{{meta.content.title}}"};</script><div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}"/></a>{{/author.avatar}}<div class="content-byline">{{#author.url}}<a class="content-author-name" href="{{author.url}}" target="_blank">{{author.displayName}}</a>{{/author.url}}{{^author.url}}{{#author.profileUrl}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a>{{/author.profileUrl}}{{^author.profileUrl}}<span class="content-author-name">{{author.displayName}}</span>{{/author.profileUrl}}{{/author.url}}</div></div></div><div class="content-attachments"></div><div class="content-body"><a href="{{meta.content.feedEntry.link}}" target="_blank">{{#meta.content.title}}{{{meta.content.title}}}{{/meta.content.title}}{{^meta.content.title}}{{{body}}}{{/meta.content.title}}</a></div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{meta.content.feedEntry.link}}" onClick="doShare(this,\'{{id}}\')" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{{formattedCreatedAt}}}</div>{{/formattedCreatedAt}}</div>';
};

LF.lfcustomcontent.prototype.instagram = function() {
	return '<script>LF.meta["{{id}}"]={"url": "{{author.profileUrl}}","image": "{{#attachments}}{{thumbnail_url}}{{/attachments}}","title":"{{meta.content.title}}"};</script><div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}" onerror="this.src=\'http://d2eb2o7oouhk1h.cloudfront.net/50.png\'"/></a>{{/author.avatar}}<div class="content-byline"><span class="content-source-logo"></span>{{#author.displayName}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a>{{/author.displayName}}{{^author.displayName}}<a class="content-author-name" href="{{author.profileUrl}}" target="_blank">{{author.id}}</a>{{/author.displayName}}</div></div></div><div class="content-attachments"></div><div class="content-body" data-content-id="{{id}}">{{{body}}}</div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{author.profileUrl}}" onClick="doShare(this,\'{{id}}\')" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{{formattedCreatedAt}}}</div>{{/formattedCreatedAt}}</div>';
};

LF.lfcustomcontent.prototype.twitter = function() {
	return '<script>LF.meta["{{id}}"]={"url": "https://twitter.com/statuses/{{tweetId}}","image": "","title":""};</script><div class="content-header">{{#sponsored}}<div id="sponsored-header"><h3>Sponsored Content</h3></div>{{/sponsored}}<div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar" href="https://twitter.com/intent/user?user_id={{author.twitterUserId}}" target="_blank"><img src="{{author.avatar}}" onerror="this.src=\'http://d2eb2o7oouhk1h.cloudfront.net/50.png\'"/></a>{{/author.avatar}}<div class="content-byline"><a class="hub-tooltip-link tooltip-twitter content-source-logo" href="https://twitter.com/statuses/{{tweetId}}/" target="_blank" title="View on Twitter"></a><div class="content-author-name"><a href="https://twitter.com/intent/user?user_id={{author.twitterUserId}}" target="_blank">{{author.displayName}}</a></div><a class="content-author-username" href="https://twitter.com/intent/user?user_id={{author.twitterUserId}}" target="_blank">@{{author.displayName}}</a></div></div></div><div class="content-attachments"></div><div class="content-body" data-content-id="{{id}}">{{{body}}}</div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="https://twitter.com/statuses/{{tweetId}}" onClick="doShare(this,\'{{id}}\')" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><ul class="content-actions"><li class="content-action" data-content-action="reply"><a class="hub-tooltip-link content-action-reply" href="https://twitter.com/intent/tweet?in_reply_to={{tweetId}}" title="Reply"><span>Reply</span></a></li><li class="content-action" data-content-action="retweet"><a class="hub-tooltip-link content-action-retweet" href="https://twitter.com/intent/retweet?tweet_id={{tweetId}}" title="Retweet"><span>Retweet</span></a></li><li class="content-action" data-content-action="favorite"><a class="hub-tooltip-link content-action-favorite" href="https://twitter.com/intent/favorite?tweet_id={{tweetId}}" title="Favorite"><span>Favorite</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at"><a href="https://twitter.com/statuses/{{tweetId}}/" target="_blank">{{{formattedCreatedAt}}}</a></div>{{/formattedCreatedAt}}</div>';
};

LF.lfcustomcontent.prototype.facebook = function() {
	return '<script>LF.meta["{{id}}"]={"url": "{{#permalink}}{{permalink}}{{/permalink}}","image": "","title":""};</script><div class="content-header"><div class="content-header-inner">{{#author.avatar}}<a class="content-author-avatar"><img src="{{author.avatar}}"/></a>{{/author.avatar}}<div class="content-byline">{{#permalink}}<a class="hub-tooltip-link tooltip-link content-source-logo" href="{{permalink}}" target="_blank" title="View on Facebook"></a>{{/permalink}}{{^permalink}}<span class="content-source-logo"></span>{{/permalink}}<div class="content-author-name"><a href="{{author.profileUrl}}" target="_blank">{{author.displayName}}</a></div></div></div></div><div class="content-attachments"></div><div class="content-body" data-content-id="{{id}}">{{{body}}}</div>{{#featured}}<div class="content-featured">Featured</div>{{/featured}}<ul class="content-actions"><li class="content-action" data-content-action="share"><a class="hub-tooltip-link content-action-share" data-content-action-share-link="{{#permalink}}{{permalink}}{{/permalink}}" onClick="doShare(this,\'{{id}}\')" title="Share"><span class="content-action-share-title">Share</span></a></li></ul><div class="content-meta">{{#formattedCreatedAt}}<div class="content-created-at">{{#permalink}}<a href="{{permalink}}" target="_blank">{{{formattedCreatedAt}}}</a>{{/permalink}}{{^permalink}}{{{formattedCreatedAt}}}{{/permalink}}</div>{{/formattedCreatedAt}}</div>';
};
})();