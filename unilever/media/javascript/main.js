var Collection = Livefyre.require("streamhub-sdk/collection");
var WallView = Livefyre.require("streamhub-wall");

var opts = [
    {
        "name": "brasil",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691195832"
    },{
        "name": "usa",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691177331"
    },{
        "name": "uk",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691147587"
    },{
        "name": "india",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691007431"
    },{
        "name": "indonesia",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383690895328"
    },{
        "name": "general",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383690820330"
    }];

for (var i = 0; i < opts.length; i++){
    var n = opts[i].name;
    window['collection_'+n] = new Collection({
        "network": opts[i].network,
        "siteId": opts[i].siteId,
        "articleId": opts[i].articleId
    });
    
    window['wall_'+n] = new WallView({
        initial: 10,
        showMore: 2,
        el: document.getElementById(n)
    });
    window['collection_'+n].pipe(window['wall_'+n]);
    window['collection_'+n].pause();
}

//initialize
$('.wall').hide();
switchWall('general');

function switchWall(name){
    var prev = $("body").find('.active').attr('id');
    
    $("body").find('.active').hide();
    $("body").find('.wall').removeClass('active');

    window['collection_'+name].pause();
    $(prev).hide();
    
    window['collection_'+name].resume();
    $('#'+name).addClass('active');
    $('#'+name).show();
}

$(function ($) {
    $('body').on('click', '*[data-wall-name]', function (e) {
        var $target = $(this);
        var wallName = $target.attr('data-wall-name');
        switchWall(wallName);
    });
});
