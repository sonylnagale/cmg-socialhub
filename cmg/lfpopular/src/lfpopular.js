var LF = LF || {};

(function($) {

/**
 * lfpopular
 * Takes an object of options, finds the highest heat from that,
 * and sets a DOM element's contents to that content
 * @param {Object} opts
 * @see defaults for structure for opts
 * @returns {LF.lfpopular} this instance
 */
LF.lfpopular = function(opts) {
	var defaults = {
		'el':'#socialPopular',
		'tag': 'heatindex',
		'siteId': null,
		'number': null,
		'network': 'client-solutions.fyre.co'
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
	this.$el.html(data.headDocument.content[0].content.bodyHtml);
};

})(Livefyre.require('streamhub-sdk/jquery'));
