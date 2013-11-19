var LF = LF || {};

(function($) {
	
/**
 * lfpopular
 * Takes an object of options, finds the highest heat from that,
 * and sets a DOM element's contents to that content
 * @author Sonyl Nagale <sonyl@livefyre.com>
 * @version 0.1
 * @param {Object} opts
 * @see defaults for structure for opts
 * @todo error handling
 * @returns {LF.lfpopular} this instance
 */
LF.lfpopular = function(opts) {
	var defaults = {
		'el':'#socialPopular',
		'tag': 'heatindex',
		'siteId': null,
		'number': null,
		'network': 'client-solutions.fyre.co',
		'truncate': '55'
	};
	
	this.opts = opts || {};
	this.opts = $.extend(defaults, this.opts);

	this.$el = $(this.opts.el);
	
	this._getHeat();
};

/**
 * @private
 * Constructs URL to fetch heat from Heat API
 */
LF.lfpopular.prototype._getHeat = function() {
	var delimeter = "?";
	
	var url = "http://bootstrap." + this.opts.network + "/api/v3.0/hottest/";
	
	if (this.opts.tag != null) {
		url += delimeter + "tag=" + this.opts.tag;
		delimeter = "&";
	}
	
	if (this.opts.site != null) {
		url += delimeter + "site=" + this.opts.site;
		delimeter = "&";
	}
	
	if (this.opts.number != null) {
		url += delimeter + "number=" + this.opts.number;
	}
	
	$.ajax({
	    url:url,
	    dataType: 'jsonp', 
	    success:$.proxy(function(json){
	        this._getContent(json);
	    },this),
	    error:function(){
	        // shh
	    }
	});		
};

/**
 * @private
 * Called by ajax return method from _getHeat
 * @param {Object} data
 */
LF.lfpopular.prototype._getContent = function(data) {
	var url = "http://bootstrap." + this.opts.network;
	url += data.data[0].initUrl;
	
	$.ajax({
	    url:url,
	    dataType: 'jsonp', 
	    success:$.proxy(function(json){
	        this._setContent(json);
	    },this),
	    error:function(){
	        // shh
	    }
	});		
};

/**
 * @private
 * Called by ajax return method from _getContent
 * Actually sets DOM info
 * @param {Object} data
 */
LF.lfpopular.prototype._setContent = function(data) {
	this.$el.html(this._truncateTitle(data.headDocument.content[0].content.bodyHtml));
	
	this.$retweet = $('#lf-retweetAction');

	this.$retweet.click(function(e) {
		var url = "https://twitter.com/intent/retweet?tweet_id=";
		var tweetId = data.headDocument.content[0].content.id.replace('tweet-','');
		tweetId = tweetId.replace('\@twitter.com','');
		window.open(url + tweetId, 'new',"width=500,height=300,left=" + (screen.width/2) + ",top=" + (screen.height/2));
	});
};

/**
 * @private
 * Truncates data on wordbreaks
 * @todo Do we have an internal one?
 * @see https://github.com/pathable/truncate
 * @param data
 * @return {String} truncated data
 */

LF.lfpopular.prototype._truncateTitle = function(data) {
	return $.truncate(data, { length: this.opts.truncate });
};

/**
 * Truncation helper
 * @see https://github.com/pathable/truncate/blob/master/jquery.truncate.js
 */
var chop = /(\s*\S+|\s)$/;

// Return a truncated html string.  Delegates to $.fn.truncate.
$.truncate = function(html, options) {
  return $('<div></div>').append(html).truncate(options).html();
};

// Truncate the contents of an element in place.
$.fn.truncate = function(options) {
  if ($.isNumeric(options)) options = {length: options};
  var o = $.extend({}, $.truncate.defaults, options);

  return this.each(function() {
    var self = $(this);

    if (o.noBreaks) self.find('br').replaceWith(' ');

    var text = self.text();
    var excess = text.length - o.length;

    if (o.stripTags) self.text(text);

    // Chop off any partial words if appropriate.
    if (o.words && excess > 0) {
      excess = text.length - text.slice(0, o.length).replace(chop, '').length - 1;
    }

    if (excess < 0 || !excess && !o.truncated) return;

    // Iterate over each child node in reverse, removing excess text.
    $.each(self.contents().get().reverse(), function(i, el) {
      var $el = $(el);
      var text = $el.text();
      var length = text.length;

      // If the text is longer than the excess, remove the node and continue.
      if (length <= excess) {
        o.truncated = true;
        excess -= length;
        $el.remove();
        return;
      }

      // Remove the excess text and append the ellipsis.
      if (el.nodeType === 3) {
        $(el.splitText(length - excess - 1)).replaceWith(o.ellipsis);
        return false;
      }

      // Recursively truncate child nodes.
      $el.truncate($.extend(o, {length: length - excess}));
      return false;
    });
  });
};

$.truncate.defaults = {

  // Strip all html elements, leaving only plain text.
  stripTags: false,

  // Only truncate at word boundaries.
  words: false,

  // Replace instances of <br> with a single space.
  noBreaks: false,

  // The maximum length of the truncated html.
  length: Infinity,

  // The character to use as the ellipsis.  The word joiner (U+2060) can be
  // used to prevent a hanging ellipsis, but displays incorrectly in Chrome
  // on Windows 7.
  // http://code.google.com/p/chromium/issues/detail?id=68323
  ellipsis: '\u2026' // '\u2060\u2026'

};




})(Livefyre.require('streamhub-sdk/jquery'));
