var score = 0;
var moves = 0;

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
		t = getRandomInt(1,16);
		while(find(num,t))
			t = getRandomInt(1,16);
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
var num = generate(16);
var c=0;
$('.effect-click .card-back .card-text').each(function(){
	$(this).html(num[c].toString());
	$(this).attr("id","A"+num[c].toString());
	c++;
});

var dodo = function()
{
	score = 15000 - (moves-30)*100;
		$('#score').html('Score: '+score);
		$('#score').show(1000);
		$.post( "/score4", { score:score} );
		$('#msg').show(1000);
};

$('.effect-click').click(function()
{
	moves++;
	$("#moves").html(moves);
	// LOGIC:
	var val = $(this)[0].innerText;
	if(A.length==16)
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
			if(A.length==16)
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