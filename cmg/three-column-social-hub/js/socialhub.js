/**
 *
 * 
 network: 'coxnews.fyre.co'
 siteId: '343943', 
 articleId: 'custom-1383676817350', news
 custom-1383676873409 experts
 custom-1383676926350 your reaction
 
 network: 'client-solutions.fyre.co'
     siteId: '346298',
     articleId: 'custom-1383098705234', bengals
     custom-1383098750826 seahawks
     custom-1383101815435 saints

 */



// Let's set up the initial data

(function() {
	
	var collections = [];
	
	var links = ['news','experts','reactions']; // make the ui for the headers 
	
	Livefyre.require([
		'streamhub-sdk/content/views/content-list-view',
		'streamhub-sdk/collection',
		'streamhub-sdk/content'
	],function (ListView, Collection, Content) {
		var optsNews = {
            "network": 		"client-solutions.fyre.co",
            "siteId": 		"346298",
            "articleId":	"custom-1383098705234"
        };
		
		var optsExperts = {
			"network": 		"client-solutions.fyre.co",
            "siteId": 		"346298",
            "articleId":	"custom-1383098750826"
		};
		
		var optsReactions = {
			"network": 		"client-solutions.fyre.co",
            "siteId": 		"346298",
            "articleId":	"custom-1383101815435"
		};
          
		// news
		var newsView = new ListView({
		    initial: 5,
		    showMore: 5,
		    el: document.getElementById("newsFeed")
		});
		
		var newsCollection = new Collection(optsNews);
		
		newsCollection.pipe(newsView);
		
		collections.push(newsCollection);
		
		// experts
		var expertsView = new ListView({
		    initial: 5,
		    showMore: 5,
		    el: document.getElementById("expertsFeed")
		});
		
		var expertsCollection = new Collection(optsExperts);
		
		expertsCollection.pipe(expertsView);
		
		collections.push(expertsCollection);
		
		// reactions
		var reactionsView = new ListView({
		    initial: 5,
		    showMore: 5,
		    el: document.getElementById("reactionsFeed")
		});
		
		var reactionsCollection = new Collection(optsReactions);
		
		reactionsCollection.pipe(reactionsView);
		
		collections.push(reactionsCollection);

		$(document).ready(function() {
			var resizeFunction = function() {
				$('#socialHub').css('minHeight',$(window).height());
			};

			resizeFunction();

			$(window).resize(function() {
				resizeFunction();
			});
			
			$("#socialHub #menu .all").click(function() {
				$("#socialHub #wall").fadeOut();
				for (var i = 0; i < collections.length; ++i) {
					collections[i].resume(); // restart the other long polls
					$('#' + links[i] + 'Link').fadeIn().animate({
						width: "343"
					});
				}
				
				
				$("#socialHub #hub").fadeIn();
			});
			
			$("#socialHub #menu .filter").click(function(){
				$("#socialHub #hub").fadeOut();
				
				for (var i = 0; i < collections.length; ++i) {
					collections[i].pause(); // kill the other long polls
				}
				
				
				
				var desiredCollection = eval($(this).data('source') + "Collection");
				desiredCollection.resume(); // just start the one we want.
				
				var desiredLink = eval($(this).data('source') + "Link");
				for (var i = 0; i < links.length; ++i) {					
					
					if (links[i] != $(desiredLink).attr('id').replace('Link','')) {
						$('#' + links[i] + 'Link').fadeOut(250);
					} else {
						$('#' + links[i] + 'Link').delay(500).fadeIn().animate({
							width: "1030"
						});
					}
				}
				
				$("#socialHub #wall").fadeOut(function() {
					$(this).fadeIn();

					// prep our wall view
					var WallView = Livefyre.require('streamhub-wall');
					
					var wallView = new WallView({
					    el: document.getElementById('wall')
					});
					
					desiredCollection.pipe(wallView);
				});
			});
		});
		
	});
	
	
}());
