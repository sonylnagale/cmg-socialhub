var Collection = Livefyre.require("streamhub-sdk/collection");
var WallView = Livefyre.require("streamhub-wall");

var opts = [
    {
        "name": "brasil",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691195832",
        "initialized": false
    },{
        "name": "usa",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691177331",
        "initialized": false
    },{
        "name": "uk",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691147587",
        "initialized": false
    },{
        "name": "india",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383691007431",
        "initialized": false
    },{
        "name": "indonesia",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383690895328",
        "initialized": false
    },{
        "name": "general",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1383690820330",
        "initialized": false
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
}

//initialize
$('#general').addClass('active');
window.collection_general.pipe(window.wall_general);
window.collection_general.initialized = true;

function switchWall(name){
    var prev = $("body").find('.active').attr('id');
    
    $("body").find('.wall').removeClass('active');

    window['collection_'+name].pause();
    $(prev).hide();
    
    if (opts[name].initialized){
        window['collection_'+name].resume();
        $('#'+name).addClass('active');
    }else{
        window['collection_'+name].pipe(window['wall_'+name]);
        opts[name].initialized = true;
    }
}