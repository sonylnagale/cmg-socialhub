<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="http://livefyre-cdn.s3.amazonaws.com/libs/sdk/v1.1.0-build.214/streamhub-sdk.gz.css" />
	<script src="http://cdn.livefyre.com/libs/sdk/v1.1.0-build.214/streamhub-sdk.min.gz.js"></script>
	<script src="http://cdn.livefyre.com/libs/apps/Livefyre/streamhub-feed/v0.0.0.build.1/streamhub-feed.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	<style>
	body { margin:0; padding:0; border:0; font-weight:inherit; font-style:inherit; font-size:100%; line-height:inherit; letter-spacing:inherit; list-style:none; text-decoration:none; }
	p { 
		margin: 1em 0; 
	}
	.content{
		border-radius: 0px;
		padding: 25px;
	}
	.content .content-body{
		font-size: 19px;
		font-family: "geogrotesque",sans-serif;
		color: #111;
		padding-top: 15px;
	}
	.content .content-author-avatar img{
		width: 55px;
		height: 55px;
	}
	.content-tweet:not(:first-child) {
		display:none;
	}
	.content .content-created-at a {
		font-family: "source sans pro", sans-serif;
		font-size: 12px;
		color: #a1a0a0;
		font-weight: 500;
	}
	.content .content-byline .content-author-name a {
		font-size: 16px;
		font-family: "geogrotesque",sans-serif;
		color: #026735;
	}
	.content .content-author-username {
		color: #026735;
	}
	.content a{
		color: #026735;
	}
	</style>
</head>
<body>
	<div id="feed"></div>
	<script type="text/javascript">
		(function () {
		    // Require streamhub-sdk and streamhub-feed
		    var Hub = Livefyre.require('streamhub-sdk'),
		        FeedView = Livefyre.require('streamhub-feed');
		    
		    // Create a feed
		    var feedView = new FeedView({
		        el: document.getElementById('feed')
		    });
		    
		    // Create a StreamManager for a Livefyre Collection
		    var streamManager = Hub.StreamManager.create.livefyreStreams({
		        network: "sportsillustrated.fyre.co",
		        siteId: 340925,
		        articleId: 'custom-1376502009321'
		    });
		    
		    /// Bind the feed to streams and start them
		    streamManager.bind(feedView).start();
		}());

		// Carousel takes three parameters:
		// T for tempo in miliseconds, e.g. 1000.
		// E for element selector, e.g. ".row-fluid.person.donation".
		// A for append to this object, e.g. "#donations".
		// Source: http://stackoverflow.com/questions/17052167/vertical-javascript-carousel
		function carousel(t, e, a) {
			var carousel = null,
			counter = 0; // Our starting point. You shouldn't change this fella.

			carousel = setInterval(function() {
				var max = $(e).length; // Get numbers of elements
				var elem = counter % max; // Modulo magic to make everything run continouosly.
				var current = $(e).eq(0); // Pick current element
				//$(e).eq(1).slideUp('slow'); // Slide next element up over the previous
				$(e).eq(0).appendTo(a); // Place the current element at the bottom
				counter++;
			}, t);
		}

		$(function() {
			s = new carousel(4200, ".content-tweet", "#feed"); // Instantiating the Carousel
		});	
	</script>
</body>
</html>