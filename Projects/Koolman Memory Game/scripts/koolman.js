
console.log("hi");
var G = {};	// for accessing variables from koolman.html
G.score = 0;
var parscore = 5000;
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

var circles = {};


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


 $('#myCanvas').click(function (e) { //Relative ( to its parent) mouse position 
    if(done)
        return;
    var posX = $(this).position().left,
        posY = $(this).position().top,
        x = (e.pageX - posX),
        y = (e.pageY - posY);
     var closepoint = getclosest(G.points,x,y);
     update_score(closepoint.d);
	 $('#score').html(G.score);
     --balls;
    if(balls<=0)
    {
        $("#balls-remaining").hide();
        $('#quit').show(1000);
        done = true;
        
        ( "/score1", { score:G.score} );


        if(G.score >= parscore)
        {
            $("#msg").html("<a href=\"/2\" class=\"btn\">level 1 over! click me for level 2</a>");
        }
        else
        {
            $("#msg").html("try again!");
            G.score = 0;
            balls = 7;
            $('#show').show();
            $("#msg").show();
            $("#balls-remaining").show();
            $("#balls-remaining").html("balls remaining: "+balls);
            $("#score").html(G.score);
            clear_visited();
        }
    }
    else 
        $("#balls-remaining").html("balls remaining: "+balls);
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
    load_game_1();

	// showCircle(circles["red"]);
	// showCircle(circles["orange"]);
    // showCircle(circles["yellow"]);
    // showCircle(circles["green"]);
    // showCircle(circles["blue"]);
    // showCircle(circles["indigo"]);
    // showCircle(circles["violet"]);
    // $("#msg").html("Predict where the balls were");
    // $("#balls-remaining").html("balls remaining: "+balls);
    // $(this).hide();
    // if(done)    done = false;

});

