<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="http://livefyre-cdn.s3.amazonaws.com/libs/sdk/v1.1.0-build.214/streamhub-sdk.gz.css" />
	<script src="http://livefyre-cdn.s3.amazonaws.com/libs/sdk/v1.1.0-build.214/streamhub-sdk.min.gz.js"></script>
	<script src="http://cdn.livefyre.com/libs/apps/Livefyre/streamhub-feed/v0.0.0.build.1/streamhub-feed.min.js"></script>
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
		        network: "thetest.fyre.co",
		        siteId: 339297,
		        articleId: 'custom-1374602801443'
		    });
		    
		    /// Bind the feed to streams and start them
		    streamManager.bind(feedView).start();
		}());
	</script>
</body>
</html>