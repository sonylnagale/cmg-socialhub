/**
* MediaWall / ListView Code
*/
Livefyre.require([
    'streamhub-sdk/collection',
    'streamhub-sdk/content/views/content-list-view',
    'streamhub-wall'],
function (Collection, ListView, WallView) {

    var collection = new Collection({
        "network": "labs-t402.fyre.co",
        "siteId": "303827",
        "articleId": "xbox-0",
        "environment": "t402.livefyre.com"
    });

    var wallView = new WallView({
        el: document.getElementById("wall"),
        minContentWidth: 220
    });

    var listView = new ListView({
        el: document.getElementById("listview")
    });
    collection.pipe(wallView);
});

/**
* LiveBlog Code
*/
(function() {
    var customStrings = {
        listenerCount: "person",
        listenerCountPlural: "people"
    };

    fyre.conv.load({
        network: 'client-solutions.fyre.co',
        strings: customStrings
    }, [{
        app: 'main',
        siteId: '333682',
        articleId: 'custom-1380734624942',
        el: 'livefyre-app-custom-1380734624942',
        checksum: '0830cae57e94e35d849232942e5d04b2',
        collectionMeta: 'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJ1cmwiOiAiaHR0cDovL3d3dy5zYW1wbGVjaGF0LmNvbS8iLCAidGFncyI6IFtdLCAiYXJ0aWNsZUlkIjogImN1c3RvbS0xMzgwNzM0NjI0OTQyIiwgInRpdGxlIjogIlNhbXBsZSBDaGF0In0.udA_N63gurorhpIV7JOO_6V4JNzB6VKuvsVmJRrqkWw'
    }], function (widget) {
        // Initialize or Auth
    });
}());
