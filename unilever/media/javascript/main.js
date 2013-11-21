var Collection = Livefyre.require("streamhub-sdk/collection");
var WallView = Livefyre.require("streamhub-wall");

var Tweets = {
    //country: ['lead text', 'author name', 'author handle']
    "indonesia": ["Kita bisa wujudkan esok yang lebih cerah bagi anak kita. Sekaranglah saat yang paling tepat untuk memulainya! <span class='blue'>#brightfuture</span>", "Virginia Hine", "@MyKindaHine"],
    "india": ["It is ALL about the children today #UNChildrensday, so I'm getting involved by supporting <span class='blue'>#brightfuture</span> to make sure they have one", "Sanjiv Mehta", "@sanjivmehta"],
    "uk": ["I'm making sure the next generation have a world that is worth living in <span class='blue'>#brightfuture</span>", "Polly", "@PollySwain"],
    "brasil": ["Temos a oportunidade de ajudar criar um <span class='blue'>#futuromelhor</span> para as crianças que estão por vir. Nunca houve um momento tão bom!", "Sergio del Prado", "@sdelprado"],
    "usa": ["Small actions = BIG difference <span class='blue'>#brightfuture</span>", "Megan Lehmann", "@TheCultureOf_"],
    "general": ["We have the opportunity to help create a <span class='blue'>#brightfuture</span> for children yet to come. There's never been a better time!", "Marc Mathieu", "@marcfmath"]
};


var CustomCountry = {
    "brasil": {
        "nav": ["Indonésia", "Índia", "Reino Unido", "Brasil", "EUA"],
        "card": ["O Mundo", "Clique aqui para ver pessoas ao redor do mundo criando um #futuromelhor"]
    },
    "indonesia": {
        "nav": ["Indonesia", "India", "Inggris", "Brasil", "Amerika Serikat"],
        "card": ["Dunia", "ihat bagaimana orang-orang dari seluruh dunia mewujudkan masa depan yang lebih cerah #brightfuture"]
    },
    "all": {
        "nav": ["Indonesia", "India", "UK", "Brazil", "USA"],
        "card": ["The World", "See the people around the world creating a #brightfuture"]
    }
};

var collections = [
    {
        "name": "brasil",
        "network": "unilever.fyre.co",
        "siteId": "347150",
        "articleId": "custom-1384845657590"
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

var NavDisplay = {
    init: function(wallName){
        WallSwitcher.switchTo(wallName);

        $('.wall-nav div').removeClass('active');
        $('[data-wall-name='+wallName+']').addClass('active');

        NavDisplay.clearDisplay();
        NavDisplay.updateDisplay(wallName);
        SmoothScroll.update();

        CustomText.update(wallName);
    },
    clearDisplay: function (){
        var cls = $('.color').attr('class'),
            active = cls.split(/[ ,]+/)[1], // update width of sun bar
            s_cls = $('.sun').attr('class'),
            s_active = s_cls.split(/[ ,]+/)[1]; // update placement of sun

        //sun bar
        if (cls && active){
            $('.color').removeClass(active);
        }

        //color bar
        if (s_cls && s_active){
            $('.sun').removeClass(s_active);
        }
    },
    updateDisplay: function (target){
        $('.color').addClass(target + '-active');
        $('.sun').addClass(target + '-active');
    }
};

var SmoothScroll = {
    update: function (){
        target = $('.wall-interior');
        if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
};

var CustomText = {
    update: function(target){
        var rq = "<span class='xl'>&rdquo;</span>",
            lq = "<span class='xl'>&ldquo;</span>";

        switch(target){
            case "brasil":
                key = "brasil";
                break;
            case "indonesia":
                key = "indonesia";
                break;
            default:
                key = "all";
        }
        
        $('.wall-hero h1').html(lq+Tweets[target][0]+rq);

        $('#world-author').html(Tweets[target][1]);
        $('#world-author-handle').html(Tweets[target][2]);
        
        $('#world-copy').html(CustomCountry[key]['card'][0]);
        $('#world-sub-copy').html(CustomCountry[key]['card'][1]);

        $('.wall-nav span').each(function(index){
            if (index > 0){
                $(this).text(CustomCountry[key]['nav'][index-1]);
            }
        });
    }
};


$(function ($) {
    // Start off on 'general' wall
    WallSwitcher.switchTo('general');
    // On click of a link, switch to that
    $('body').on('click', '*[data-wall-name]', function (e) {
        var $target = $(this);
        var wallName = $target.attr('data-wall-name');
        
        NavDisplay.init(wallName);
    });

    $('select').on('change', function() {
        var wallName = $(this).val();
        NavDisplay.init(wallName);
        
    });

    // Update sun styling on hover
    $('.wall-nav div').on('mouseover', function () {
        NavDisplay.clearDisplay();
        NavDisplay.updateDisplay($(this).attr('data-wall-name'));
    });

    // Update sun styling on hover
    $('.wall-nav').on('mouseleave', function () {
        var target = $(this).find('.active').attr('data-wall-name');

        NavDisplay.clearDisplay();
        NavDisplay.updateDisplay(target);
    });
});