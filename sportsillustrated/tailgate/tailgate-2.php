<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="http://livefyre-cdn.s3.amazonaws.com/libs/sdk/v1.0.1-build.147/streamhub-sdk.gz.css" />
	<script src="http://cdn.livefyre.com/libs/sdk/v1.0.1-build.167/streamhub-sdk.min.gz.js"></script>
	<script src="http://cdn.livefyre.com/libs/apps/Livefyre/streamhub-feed/v0.0.0.build.1/streamhub-feed.min.js"></script>
	<style>
		body {
			margin-top: 285px;
			background: #c293c8; /* Old browsers */
			/* IE9 SVG, needs conditional override of 'filter' to 'none' */
			background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPgogICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2MyOTNjOCIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjI3JSIgc3RvcC1jb2xvcj0iI2ZmZmZmZiIgc3RvcC1vcGFjaXR5PSIxIi8+CiAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMSIvPgogIDwvbGluZWFyR3JhZGllbnQ+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0idXJsKCNncmFkLXVjZ2ctZ2VuZXJhdGVkKSIgLz4KPC9zdmc+);
			background: -moz-linear-gradient(top,  #c293c8 0%, #ffffff 27%, #ffffff 100%); /* FF3.6+ */
			background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#c293c8), color-stop(27%,#ffffff), color-stop(100%,#ffffff)); /* Chrome,Safari4+ */
			background: -webkit-linear-gradient(top,  #c293c8 0%,#ffffff 27%,#ffffff 100%); /* Chrome10+,Safari5.1+ */
			background: -o-linear-gradient(top,  #c293c8 0%,#ffffff 27%,#ffffff 100%); /* Opera 11.10+ */
			background: -ms-linear-gradient(top,  #c293c8 0%,#ffffff 27%,#ffffff 100%); /* IE10+ */
			background: linear-gradient(to bottom,  #c293c8 0%,#ffffff 27%,#ffffff 100%); /* W3C */
			filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#c293c8', endColorstr='#ffffff',GradientType=0 ); /* IE6-8 */
			background-repeat: no-repeat;
		}
		section {background-color: white; padding: 10px; width: 800px; margin: 50px auto; z-index: 25}
		img.bg-logo {position:absolute; z-index:-1; top: 10px; left: 10px	;}
		.content {z-index: 50; font-size: 24px;}
		a {color: #fa703d;}
		.content-author-name{
			margin-bottom: 15px;
		}
		article {
			-moz-border-radius: 10px;
			-webkit-border-radius: 10px;
			border-radius: 10px; /* future proofing */
			-khtml-border-radius: 10px; /* for old Konqueror browsers */
		}
	</style>
</head>
<body>
	<img class="bg-logo" src="thetest.png">
	<section>
		<div id="feed"></div>
	</section>
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
		        articleId: 'custom-1374602862581'
		    });
		    
		    /// Bind the feed to streams and start them
		    streamManager.bind(feedView).start();
		}());
	</script>
</body>
</html>