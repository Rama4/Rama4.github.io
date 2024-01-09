/*              ·~=≠≠x#≠≠=-                         ·=≈≠xxx≠≈~-·              
            ·~≠#%&$$$$&%x≈~·                        ~=≠#%$$$$$&%x≈-           
          ~x&$$$$$$$x~·  -%~                        #≈   -≈&$$$$$$$#≈·        
        =%$$$$$$$$$$-  -≠$$-                        x$%=·  x$$$$$$$$$&≠-      
      -%$$$$$$$$$$$$$%%$$$≈                         ·&$$&%&$$$$$$$$$$$$&≠     
     ·&$$$$$$$$$$$$$$$$$&=                           ·#$$$$$$$$$$$$$$$$$$≈    
     ≈$$$$$$$$$$$$$$$$$#-                              ≈&$$$$$$$$$$$$$$$$$    
     ≈$$$$$$$$$$$$$$$$$                                 ≈$$$$$$$$$$$$$$$$$    
     ·%$$$$$$$$$$$$$$$≈                                  &$$$$$$$$$$$$$$$=    
      ~#$$$$$$$$$$$$&≈                                   ·#$$$$$$$$$$$$&x     
      #%%%&&$$$$$&%≈-     =-   ·-=≈≈xxxxxx≠≠=~-·  -=       =x%$$$$$$&&%%&-    
      ≈$$&&%###≠~-       ·$&≈x%&$$$$$$$$$$$$$$$%#≠&$-        ·-≈###%&&$$%     
       #$$$$$$$x        ·≈$$$$$$$$$$$$$$$$$$$$$$$$$$%≈-        -$$$$$$$$~     
       ·x&$$&&%##≈-   ~x&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$#=·  ·=x#%&&&$&%=      
         -%&$$$$$$$≠=%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&x≈%$$$$$$$&≈        
           -=≠x#%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%#≠=~·         
             ·~≠%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%≠=-·          
≈====≈≠≠≠xx#%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&%%#xx≠≠≈=≈
%&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&%
 ··-=x%$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$%x=-·· 
       -≈#&$$$$$$$$$$$$$$$$$$$$&$$$$$$$$$$$$$$&$$$$$$$$$$$$$$$$$$$$&#≈-       
          ·=%$$$$$$$$$$$$$$$$$$%=x%$$$$$$$$%≠~%$$$$$$$$$$$$$$$$$$%=·          
     ·-~≈≠x#%$$$$$$$$$$$$$$$$$$$x  -x$$$$≠·  x$$$$$$$$$$$$$$$$$$$%#x≠≈~-·     
   =≠&$$$$$%%%&$&%$$$$$$$$$$$$$$$%≠≠%$$$$%≠≠&$$$$$$$$$$$$$$$%&$&%%%$$$$$&≠~   
  -$&$&#≠==x&$$%%$$~~≠#&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$&#≠~~$$%%$$&x==≠#%$%$=  
  ≈$$$~  ≈%$$#x&$$~    ·-=≠#%&&$$$$$$$$$$$$$$$$&%%#≠=-·    ~$$&x#$$%≈  -$$$x  
  ≠$$≠  #$$%-~%$#~           ··-~~==========~~-··           ~#$%~·%$$#  =$$#  
  ≠$%  ·$$#·-$&≈                                              ≠&$-·#$$·  #$#  
  ≈$=  ~$%  -$&                                                &$·  %$~  -$x  
  -&   ~$~   &≠                                                #%   ~$~   #=*/




/*


	TWIST NOTATION

	UPPERCASE = Clockwise to next 90 degree peg
	lowercase = Anticlockwise to next 90 degree peg



	FACE & SLICE ROTATION COMMANDS

	F	Front
	S 	Standing (rotate according to Front Face's orientation)
	B 	Back
	
	L 	Left
	M 	Middle (rotate according to Left Face's orientation)
	R 	Right
	
	U 	Up
	E 	Equator (rotate according to Up Face's orientation)
	D 	Down



	ENTIRE CUBE ROTATION COMMANDS
	
	X   Rotate entire cube according to Right Face's orientation
	Y   Rotate entire cube according to Up Face's orientation
	Z   Rotate entire cube according to Front Face's orientation



	NOTATION REFERENCES

	http://en.wikipedia.org/wiki/Rubik's_Cube#Move_notation
	http://en.wikibooks.org/wiki/Template:Rubik's_cube_notation

*/


$(document).ready( function(){ 


	var useLockedControls = true,
		controls = useLockedControls ? ERNO.Locked : ERNO.Freeform;

	var ua = navigator.userAgent,
		isIe = ua.indexOf('MSIE') > -1 || ua.indexOf('Trident/') > -1;

	window.cube = new ERNO.Cube({
		hideInvisibleFaces: true,
		controls: controls,
		renderer: isIe ? ERNO.renderers.IeCSS3D : null
	});


	var container = document.getElementById( 'container' );
	container.appendChild( cube.domElement );



	if( controls === ERNO.Locked ){
		var fixedOrientation = new THREE.Euler(  Math.PI * 0.1, Math.PI * -0.25, 0 );
		cube.object3D.lookAt( cube.camera.position );
		cube.rotation.x += fixedOrientation.x;
		cube.rotation.y += fixedOrientation.y;
		cube.rotation.z += fixedOrientation.z;
	}


	// The deviceMotion function provide some subtle mouse based motion
	// The effect can be used with the Freeform and Locked controls.
	// This could also integrate device orientation on mobile

	// var motion = deviceMotion( cube, container );

	// motion.decay = 0.1; 				// The drag effect
	// motion.range.x = Math.PI * 0.06;	// The range of rotation 
	// motion.range.y = Math.PI * 0.06;
	// motion.range.z = 0;
	// motion.paused = false;				// disables the effect

	RUBIK = new Rcube();
	window.noturn = 0;
	

	var ind=0,k=0;
	// var RUBIK;	// declaring the variable here and initialising  in main.js, to not get 'RUBIK is not defined' in any file.
	let move_description_index = 0;
	
	const MOVE_COLOR_ACTIVE = "orange";
	const MOVE_COLOR_INACTIVE = "white";

	$('#solution-box').hide();
	$('#solution-guide').hide();
	
	const get_ind = function(s)
	{
		s = s.substring(5,s.length);
		return parseInt(s);
	};
	const get_k = function(s)
	{
		s = s.substring(4,5);
		return parseInt(s);
	};
	$('#moves-submit').click(function()
	{
		const inp = $('#moves-input').val();
		RUBIK.parse(inp);
	});
	
	$("#scramble").click(function()
	{
		RUBIK.scramble();    
	});		
	$("#breakit").click(function()
	{
		RUBIK.breakit();    
	});		

	const show_solution_description = function() {
		console.log("show_solution_description()");
		let j = RUBIK.move_descriptions[k]?.findLastIndex((element) => element.index <= ind);
		const jind = RUBIK.move_descriptions[k][j]?.index;
		console.log("k=",k,"ind=",ind,"jind=",jind);
		let movMsgStr = "";
		if(jind != undefined){
			for(;j>=0 && RUBIK.move_descriptions[k][j]?.index === jind;j--){
				movMsgStr = `${RUBIK.move_descriptions[k][j].str} ${movMsgStr}`;
			}
		}
		$("#solution-guide-description").html(movMsgStr);
	}
	
	$('#solve3x3').click(function()
	{   

		window.noturn = 1;
		// disable keyboard and mouse controls
		window.cube.mouseControlsEnabled = false;
		window.cube.keyboardControlsEnabled = false;	
		
		RUBIK.solve();
		
		// nana
		window.noturn = 0;
		// Enable keyboard and mouse controls
		window.cube.mouseControlsEnabled = true;
		window.cube.keyboardControlsEnabled = true;


		RUBIK.loadCubeStateFromString(RUBIK.states[0]);
		var innerHTML  = "";
		for(let layer=0;layer<3;layer++)
		{
			innerHTML += '<h4><strong>layer '+(layer+1)+'</strong></h4>';
			for(var i=0;i<RUBIK.solution_moves_list[layer].length;i++)
			{
				innerHTML += '<span id=\'move'+layer+i+'\'>'+RUBIK.solution_moves_list[layer][i]+'</span> ';
			}
			innerHTML += '<br>';
		}
		innerHTML += "<br><div class=\'row text-center\'>";
		innerHTML += "<div class=\"btn\" id=\"prev\"><</div> ";
		innerHTML += "<div class=\"btn\" id=\"next\">></div> ";
		innerHTML += "</div>";

		
		var ele=null;
		k=ind=0;
		let solutionHTML = "<div class=\'row text-center\'>";
		solutionHTML += `<h3 >Solving layer : <span id="solution-guide-layer">${k+1}</span></h3>`;
		solutionHTML += `<h4 >Step : <span id="solution-guide-step">${ind}</span></h4>`;
		solutionHTML += `<p id="solution-guide-description"></p>`;
		solutionHTML += "</div>";
		
		
		$('#solution-guide').html(solutionHTML);
		$('#solution-box').html(innerHTML);
		$("#move00").css("color",MOVE_COLOR_ACTIVE);
		
		$('#solution-guide').show(1000);
		$('#solution-box').show(1000);
		
		console.log(RUBIK.move_descriptions);
		show_solution_description();
		
		$('#prev').click(function()
		{
			window.cube.setTwistDuration();
			ele = '#move'+k+ind;
			$(ele).css("background","rgba(255,0,0,0.15)");  
			$(ele).css("color",MOVE_COLOR_INACTIVE);

			if(ind > 0)
			{	
				RUBIK.parse(RUBIK.solution_moves_list[k][ind],true);
				ind--;
				$('#solution-guide-step').html(ind+1);
			}
			else if(k > 0)
			{
				--k;
				ind = RUBIK.solution_moves_list[k].length-1;
				$('#solution-guide-layer').html(k+1);
			}
			ele = "#move"+k+ind;
			$(ele).css("color",MOVE_COLOR_ACTIVE);
			show_solution_description();
		
		});
		$('#next').click(function()
		{
			window.cube.setTwistDuration();
			ele = '#move'+k+ind;
			$(ele).css("background","rgba(255,0,0,0.15)");  
			$(ele).css("color",MOVE_COLOR_INACTIVE);

			if(RUBIK.solution_moves_list[k].length > 1 && ind < RUBIK.solution_moves_list[k].length-1)				
			{
				RUBIK.parse(RUBIK.solution_moves_list[k][ind+1]); 
				$('#solution-guide-step').html(ind+1);
				ind++;
			}
			else if(k<2)
			{
				++k;
				ind = 0;
				$('#solution-guide-layer').html(k+1);
			}
			ele = "#move"+k+ind;
			$(ele).css("color",MOVE_COLOR_ACTIVE);
			show_solution_description();

		});
		var activeItem = null;
		$("#solution-box>span").hover(
			function() // mouse enter
			{
				$(this).css("background",MOVE_COLOR_ACTIVE);
			},
			function() // mouse leave
			{
				if(activeItem != this)
					$(this).css("background","rgba(255,0,0,0.15)");  
			});
		$("#solution-box>span").click(function() 
		{
			window.cube.setTwistDuration(100);

			ele = '#move'+k+ind;
			const from_k = k, from_ind = ind;
			$(ele).css("color",MOVE_COLOR_INACTIVE);
			$(ele).css("background","rgba(255,0,0,0.15)");  
			$(this).css("background",MOVE_COLOR_ACTIVE);
			ind = get_ind(this.id);
			k = get_k(this.id);
			activeItem = this;
			$('#solution-guide-layer').html(k+1);
			$('#solution-guide-step').html(ind+1);
			RUBIK.go_to_move_in_solution(from_k,from_ind ,k,ind);
		});
	});
	


});
