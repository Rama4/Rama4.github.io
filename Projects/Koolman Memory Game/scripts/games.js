//-------------------------------------------------------------------
// landing
//-------------------------------------------------------------------

const GAME_ENUM = {
    NONE: 0,
    KOOLMAN: 1,
    BUBBLES: 2,
    CARDS: 3,
    SCORES: 4,
}
let current_game = GAME_ENUM.NONE;

let username = "";

function cache_username() {
    if(localStorage.username !== undefined) {
        username = localStorage.username;
    }
    console.log("caching username: " + username);
    localStorage.username = username;
}

$("#anonymous").click(function () {
    username = "Tourist";
    cache_username();
    load_game_1();
});

$("#login-button").click(function () {
    let u = $("#username").val();
    console.log("username=", u);
    username = u;
    cache_username();
    load_game_1();
});

function load_game_1() {
    $(location).prop('href', 'koolman.html');
    current_game = GAME_ENUM.KOOLMAN;
    localStorage.current_game = GAME_ENUM.KOOLMAN.toString();
}

let scores = [0,0,0,0,0];
if(localStorage.scores !== undefined && localStorage.scores.length > 1) {
    scores = JSON.parse(localStorage.scores);
}

function save_game_score(gameId, score) {
    if(localStorage.scores !== undefined && localStorage.scores.length > 1) {
        scores = JSON.parse(localStorage.scores);
    }
    scores[gameId] = score;
    localStorage.scores = JSON.stringify(scores);
}

console.log("localStorage.current_game=", localStorage.current_game);

if(current_game == GAME_ENUM.NONE)
    current_game = localStorage.current_game ?? current_game;

console.log("current game = " + current_game);



//-------------------------------------------------------------------
// Game 1
//-------------------------------------------------------------------

if(current_game == GAME_ENUM.KOOLMAN) {

    console.log("hi");
    let G = {};	// for accessing variables from koolman.html

    var parscore = 1000;
    var balls=7;  // remaining balls;
    var done = false;
    var canvas = $("#myCanvas")[0];
    var ctx = canvas.getContext("2d");
    var startTime = lastTime = performance.now();
    var vis = [];
    var points = [],
        radius = 20,
        Width = 1300,
        Height = 500;

    let circles = {};
    let score = 0;
    G.circles = circles;
    G.points = points;	
    G.score = score;
    


    $('#quit').hide();
    $('#myCanvas').css({"width":Width.toString(),"height":Height.toString()});
    $('#strip').css("max-width",''+Width.toString()+'px');

    // NOTE: see below
    //      todo : save already clicked ball
    var clear_visited = function()
    {
    vis = [0,0,0,0,0,0,0];
    };

    function generateCenter()
    {
        var maxAttempts = 5;
        while(maxAttempts-- > 0)
        {
            var x = Math.floor(Math.random()*Width), y = Math.floor(Math.random()*Height),	available = true,dx,dy,point;
            if(x<radius)x+=radius;
            if(y<radius)y+=radius;
            if((Height-x)<radius)x-=radius;
            if((Height-y)<radius)y-=radius;
            for(var i=0;i<points.length;i++) 
            { 
                point = points[i];
                dx = Math.abs(point.x-x)  , dy = Math.abs(point.y-y);
                if( Math.sqrt(dx*dx+dy*dy) < 2*radius) 
                {        available = false;   console.log("failed attempt-> "+x+","+y);     break;      }
            }
            if(available) {      points.push({x: x,y: y}); console.log(x+" , "+y);   return {x:x,y:y}; }
        }
    }
    
    var initialise = function()
    {
        G.score = 0;
        var cent = generateCenter();
        var t_visible = 1500;	// milliseconds
        circles.red = ({
            x: cent.x,
            y: cent.y,
            radius: 20,
            color: "red",
            visibleDuration: t_visible,
            visibleCountdown: 1000
        });
        cent = generateCenter();
        circles.orange = ({
        x: cent.x,
            y: cent.y,
            radius: 20,
            color: "orange",
            visibleDuration: t_visible,
            visibleCountdown: 1000,
        });
        cent = generateCenter();
        circles.yellow = ({
            x: cent.x,
            y: cent.y,
            radius: 20,
            color: "yellow",
            visibleDuration: t_visible,
            visibleCountdown: 1000
        });
        cent = generateCenter();
        circles.green = ({
            x: cent.x,
            y: cent.y,
            radius: 20,
            color: "green",
            visibleDuration: t_visible,
            visibleCountdown: 1000
        });
        cent = generateCenter();
        circles.blue = ({
            x: cent.x,
            y: cent.y,
            radius: 20,
            color: "blue",
            visibleDuration: t_visible,
            visibleCountdown: 1000
        });
        cent = generateCenter();
        circles.indigo = ({
            x: cent.x,
            y: cent.y,
            radius: 20,
            color: "indigo",
            visibleDuration: t_visible,
            visibleCountdown: 1000
        });
        cent = generateCenter();
        circles.violet = ({
        x: cent.x,
            y: cent.y,
            radius: 20,
            color: "violet",
            visibleDuration: t_visible,
            visibleCountdown: 1000
        });

        clear_visited();
        $('#score').text(G.score);
    };

    var update_score=function(d)
    {
        if(d<=5)
            G.score += 5000;
        else if(d<=25)
            G.score += 2000; 
        else if(d<=50)
            G.score += 700;
        else if(d<=100)
            G.score += 500;
        else
            G.score += 100;
    };

    var getclosest=function(arr,x,y)
    {
        console.log(G);
        var d=2147483648,sx,sy,j;
        for(var i=0;i<arr.length;i++)
        {
            sx = Math.abs(arr[i].x-x) , sy = Math.abs(arr[i].y-y);
            if(Math.sqrt(sx*sx+sy*sy)<d && vis[i]==0)
                d = Math.sqrt(sx*sx+sy*sy)	 , j=i;
        }
        vis[j] = 1;
        return {d:d,i:j};	// return distance and index
    };
    console.log(G);


    $('#myCanvas').on("click", function (e) { //Relative ( to its parent) mouse position 
        console.log("canvas clicked G=", G);
        if(done)
            return;
        var posX = $(this).position().left,
            posY = $(this).position().top,
            x = (e.pageX - posX),
            y = (e.pageY - posY);
        var closepoint = getclosest(G.points,x,y);
        update_score(closepoint.d);
        $('#score').text(G.score);
        --balls;
        if(balls<=0)
        {
            save_game_score(GAME_ENUM.KOOLMAN, G.score);
            $("#balls-remaining").hide();
            $('#quit').show(1000);
            done = true;


            if(G.score >= parscore)
            {
                $("#msg").html("<button id=\"goto-game-3\" class=\"btn\">level 1 over! click me for level 2</button>");
            }
            else
            {
                Scores[KOOLMAN] = G.score;
                $("#msg").html("try again!");
                G.score = 0;
                balls = 7;
                $('#show').show();
                $("#msg").show();
                $("#balls-remaining").show();
                $("#balls-remaining").html("circles remaining: "+balls);
                $("#score").html(G.score);
                clear_visited();
            }
        }
        else 
            $("#balls-remaining").html("circles remaining: "+balls);
    });


    function animate(currentTime) {

        requestAnimationFrame(animate);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var elapsed = currentTime - lastTime;
        lastTime = currentTime;

        for (var i in circles) {
            var circle = circles[i];
            circle.visibleCountdown -= elapsed;
            if (circle.visibleCountdown > 0) {
                drawCircle(circle);
            }
            else
                circle.visibleCountdown=0;
        }
    }

    function drawCircle(circle) {
        ctx.globalAlpha = circle.visibleCountdown / circle.visibleDuration;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.globalAlpha = 1.00;
    }

    function showCircle(circle) {
    circle.visibleCountdown = circle.visibleDuration;
    }

    /*------------------------------------------------------------------------------------*/
    initialise();
    animate();
    console.log(points);
    
    $("#show").click(function(){

        showCircle(circles["red"]);
        showCircle(circles["orange"]);
        showCircle(circles["yellow"]);
        showCircle(circles["green"]);
        showCircle(circles["blue"]);
        showCircle(circles["indigo"]);
        showCircle(circles["violet"]);
        $("#msg").html("Guess where the circles were");
        $("#balls-remaining").html("circles remaining: "+balls);
        $(this).hide();
        if(done)    done = false;

    });

    $("#msg").on("click", "#goto-game-3", function(){
        console.log("game 3 loading");
        load_game_3();
    });

    function load_game_3() {
        $(location).prop('href', 'bubbles.html');
        localStorage['current_game'] = GAME_ENUM.BUBBLES.toString();
    }

    $("#quit").on("click", () => {
        localStorage['current_game'] = GAME_ENUM.SCORES.toString();
    });
    setup();
        
}


//-------------------------------------------------------------------
// Game 3:
//-------------------------------------------------------------------
if(current_game == GAME_ENUM.BUBBLES)
{

    var score = 0;
    var n = 6;
    var wrong = 0;
    var totalClicks=0;
    $('#msg').hide();
    //$("#quit").hide();

    $('body').click(function()
    {
        console.log("wrong");
        wrong++;
        if(++totalClicks==20)$('#quit').show(1000);
        score -= 60;
        $('#wrong').html(wrong);
        $('#score').html(score);
    });

    $('#cont>span').click(function(event)
    {	
        if(++totalClicks==20)$('#quit').show(1000);
        score += 1200;
        n--;
        if(n==0)
        {//  over
            console.log("wrong="+wrong);
            $('#msg').show(1000);
            save_game_score(GAME_ENUM.BUBBLES, score);
            // $.post( "/score3", { score:score} );
        }
        console.log(this.className);
            $(this).remove();
            $('#score').html(score);
            // prevent event from propogating to parent, else a click on a ball will be counted as both correct and incorrect
            event.stopPropagation();	
    });

    $('#quit').click(function(event) {
        save_game_score(GAME_ENUM.BUBBLES, score);
        localStorage['current_game'] = GAME_ENUM.SCORES.toString();
        // $.post( "/score3", { score:score} ); 
    });

    $("#msg").on("click", function(){
        console.log("game 4 loading");
        load_game_4();
    });

    function load_game_4() {
        $(location).prop('href', 'memory.html');
        localStorage['current_game'] = GAME_ENUM.CARDS.toString();
    }

}

//-------------------------------------------------------------------
// Game 4:
//-------------------------------------------------------------------
if(current_game == GAME_ENUM.CARDS) {

    var score = 0;
    var moves = 0;
    let TOTAL_CARDS = 16;

    var getRandomInt = function(min, max) 
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var find = function(arr,k)
    {
        for(var i=0;i<arr.length;i++)
            if(arr[i]==k)
                return 1;
        return 0;
    };

    var generate = function(n)
    {
        var c=0,t,num=[];
        while(c++<n)
        {
            t = getRandomInt(1,TOTAL_CARDS);
            while(find(num,t))
                t = getRandomInt(1,TOTAL_CARDS);
            num.push(t);
        }
        return num;
    }

    var comp = function(a,b)
    {
        return a-b;
    }

    var A = [];

    $('#msg').hide();
    $('#score').hide();
    var num = generate(TOTAL_CARDS);
    var c=0;
    $('.effect-click .card-back .card-text').each(function(){
        $(this).html(num[c].toString());
        console.log(num[c].toString());
        $(this).attr("id","A"+num[c].toString());
        c++;
    });

    var dodo = function()
    {
        score = 15000 - (moves-30)*100;
        $('#score').html('Score: '+score);
        $('#score').show(1000);
        // $.post( "/score4", { score:score} );
        save_game_score(GAME_ENUM.CARDS, score);
        $('#msg').show(1000);
    };

    $('.effect-click').click(function()
    {
        moves++;
        $("#moves").html(moves);
        // LOGIC:
        var val = $(this)[0].innerText;
        if(A.length==TOTAL_CARDS)
        {
            // game over
            dodo();
        }
        if(A.length==0)
            A.push(val) , console.log(A);
        else
        {
            A.sort(comp);
            console.log(A);
            
            //if(A[0]==(val+1))
                //A.push(val) , console.log("don't flip");
            if(A[A.length-1] == (val-1))
            {	A.push(val) , console.log("don't flip");
                if(A.length==TOTAL_CARDS)
            {
                // game over
                dodo();
            }
                
            }
            else
            {
                for(var i=0;i<A.length;i++)
                {
            //		console.log(A[i]);
                    //console.log($('#A'+A[i]).parent().parent());
                    var c = $('#A'+A[i]).parent().parent()[0].classList;
                    c.contains("flipped") === true ? c.remove("flipped") : c.add("flipped");
                }
                    A = [val];
            }
        }
    });

    $("#msg").on("click", function(){
        console.log("scores loading");
        load_scores();
    });

    function load_scores() {
        $(location).prop('href', 'scores.html');
        localStorage['current_game'] = GAME_ENUM.NONE.toString();
    }

    $("#quit").on("click", () => {
        localStorage['current_game'] = GAME_ENUM.SCORES.toString();
    });

}
//-------------------------------------------------------------------
// Scores:
//-------------------------------------------------------------------
if(current_game == GAME_ENUM.SCORES) {
    username = localStorage.username;
    console.log(username);
    $("#scores_heading").html(`Summary of ${username}`);
    
    $("#username").html(username);
    $("#lscore1").html(scores[GAME_ENUM.KOOLMAN]);
    $("#lscore2").html(scores[GAME_ENUM.BUBBLES]);
    $("#lscore3").html(scores[GAME_ENUM.CARDS]);

    let totalScore = 0;
    for(var i=0;i<scores.length;i++)
        totalScore += scores[i];
    $("#lscore").html(totalScore);

}
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------
//-------------------------------------------------------------------