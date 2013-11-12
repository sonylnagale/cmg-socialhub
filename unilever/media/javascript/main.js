var Collection = Livefyre.require("streamhub-sdk/collection");
var WallView = Livefyre.require("streamhub-wall");

var collections = [
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

var walls = collections.reduce(function (prev, next) {
    var name = next.name;
    var wall = prev[name] = {};
    wall.collection = new Collection(next);
    wall.view = new WallView({
        columns: 3,
        showMore: 2,
        el: document.getElementById(name)
    });
    wall.piped = false;
    return prev;
}, {});

var WallSwitcher = {
    currentWall: null,
    switchTo: function (name) {
        var currentWall = this.currentWall;
        var newWall = walls[name];
        if ( ! newWall) {
            throw new Error('WallSwitcher.switchTo passed unknown wall name');
        }
        if (currentWall) {
            currentWall.collection.pause();
            currentWall.view.$el.hide();
        }
        if (newWall.piped) {
            newWall.collection.resume();
        } else {
            newWall.collection.pipe(newWall.view);
            newWall.piped = true;
        }
        newWall.view.$el.show();
        this.currentWall = newWall;
    }
};


$(function ($) {
    // Start off on 'general' wall
    WallSwitcher.switchTo('general');
    // On click of a link, switch to that
    $('body').on('click', '*[data-wall-name]', function (e) {
        var $target = $(this);
        var wallName = $target.attr('data-wall-name');
        WallSwitcher.switchTo(wallName);

        $('.wall-nav div').removeClass('active');
        $(this).addClass('active');
    });


    // Update sun styling on hover
    $(".wall-nav div").on("mouseover", function () {
        var cls = $('.color').attr('class'),
            active = cls.split(/[ ,]+/)[1], // update width of sun bar
            s_cls = $('.sun').attr('class'),
            s_active = s_cls.split(/[ ,]+/)[1]; // update placement of sun

        //sun bar
        if (cls && active){
            $('.color').removeClass(active);
        }

        if (s_cls && s_active){
            $('.sun').removeClass(s_active);
        }

        $('.color').addClass($(this).attr('data-wall-name') + '-active');
        $('.sun').addClass($(this).attr('data-wall-name')+ '-active');


    });
});
