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
		$.post( "/score3", { score:score} );
	}
	console.log(this.className);
		$(this).remove();
		$('#score').html(score);
		// prevent event from propogating to parent, else a click on a ball will be counted as both correct and incorrect
		event.stopPropagation();	
});

$('#quit').click(function(event) {
    $.post( "/score3", { score:score} ); 
});