	
/*
	my moves notation is mapped with chrome cube labs' notation in doit() function in Rcube
*/

class Rcube
{
    constructor(cube)
    {
		Gcube = cube;
		var i,j,k,p,q;
        var mlk=0,store=0;
        var MoveMap=[],InvMoveMap=[],E3Arr=[],C3Arr=[],savedEdgeArr=[],savedCornerArr=[];      
        var left=0,front=1,right=2,back=3,top=4,down=5,ck=6,ack=7;    
        var col = [];	// for coloring tiles in css
        col["O"]="orange";col["W"]="white";col["R"]="red";col["Y"]="yellow";col["B"]="blue";col["G"]="green";
        var moves = new Array();    // store moves
        var moves2 = new Array();    // store optimized moves
        var ml = new Array(3); // store solution moves layerwise
        var b = new Array(6); /* 3d array (here, defining 1st dimension)*/
        var t = new Array(), t2 = new Array();
        for(i=0;i<4;i++)
            t2[i] = new Array();
        var colors = "GWBYOR";
        for( i=0;i<6;i++)   // set size for the 3d array 'a'
        {
           b[i] = new Array(3);
            for( j=0;j<3;j++)
            {
				b[i][j] = new Array(3);
            }
        }
        i=0;
        MoveMap["R'"]=i++;    MoveMap["R"]=i++;     MoveMap["L'"]=i++;    MoveMap["L"]=i++;
        MoveMap["U'"]=i++;    MoveMap["U"]=i++;     MoveMap["D'"]=i++;    MoveMap["D"]=i++;
        MoveMap["F'"]=i++;    MoveMap["F"]=i++;     MoveMap["B'"]=i++;    MoveMap["B"]=i++;
        MoveMap["M'"]=i++;    MoveMap["M"]=i++;     MoveMap["E'"]=i++;    MoveMap["E"]=i++;
        MoveMap["S'"]=i++;    MoveMap["S"]=i++;
		MoveMap["r'"]=i++;    MoveMap["r"]=i++;     MoveMap["l'"]=i++;    MoveMap["l"]=i++;
        MoveMap["u'"]=i++;    MoveMap["u"]=i++;     MoveMap["d'"]=i++;    MoveMap["d"]=i++;
        MoveMap["f'"]=i++;    MoveMap["f"]=i++;     MoveMap["b'"]=i++;    MoveMap["b"]=i++;
        MoveMap["X'"]=i++;    MoveMap["X"]=i++;     MoveMap["Y'"]=i++;    MoveMap["Y"]=i++;
		MoveMap["Z'"]=i++;    MoveMap["Z"]=i++;
		i=0;
        InvMoveMap["R"]=i++;    InvMoveMap["R'"]=i++;     InvMoveMap["L"]=i++;    InvMoveMap["L'"]=i++;
        InvMoveMap["U"]=i++;    InvMoveMap["U'"]=i++;     InvMoveMap["D"]=i++;    InvMoveMap["D'"]=i++;
        InvMoveMap["F"]=i++;    InvMoveMap["F'"]=i++;     InvMoveMap["B"]=i++;    InvMoveMap["B'"]=i++;
        InvMoveMap["M"]=i++;    InvMoveMap["M'"]=i++;     InvMoveMap["E"]=i++;    InvMoveMap["E'"]=i++;
        InvMoveMap["S"]=i++;    InvMoveMap["S'"]=i++;
		InvMoveMap["r"]=i++;    InvMoveMap["r'"]=i++;     InvMoveMap["l"]=i++;    InvMoveMap["l'"]=i++;
        InvMoveMap["u"]=i++;    InvMoveMap["u'"]=i++;     InvMoveMap["d"]=i++;    InvMoveMap["d'"]=i++;
        InvMoveMap["f"]=i++;    InvMoveMap["f'"]=i++;     InvMoveMap["b"]=i++;    InvMoveMap["b'"]=i++;
        InvMoveMap["X"]=i++;    InvMoveMap["X'"]=i++;     InvMoveMap["Y"]=i++;    InvMoveMap["Y'"]=i++;
        InvMoveMap["Z"]=i++;    InvMoveMap["Z'"]=i++;
        var InvMove = [
       	"R'",	"R",	  "L'",	  "L",
        "U'",    "U",     "D'",    "D",
        "F'",    "F",     "B'",    "B",
        "M'",    "M",     "E'",    "E",
        "S'",    "S",
		"r'",    "r",     "l'",    "l",
        "u'",    "u",     "d'",    "d",
        "f'",    "f",     "b'",    "b",
        "X'",    "X",     "Y'",    "Y",
        "Z'",    "Z"
        ];
				
		
		savedEdgeArr['O'] = 0,savedEdgeArr['W'] = 0,savedEdgeArr['R'] = 0,savedEdgeArr['Y'] = 0,savedEdgeArr['B'] = 0,savedEdgeArr['G'] = 0;
		savedCornerArr["B R"] = 0,savedCornerArr["B O"] = 0,savedCornerArr["G O"] = 0,savedCornerArr["G R"] = 0;
		// edge pieces of 3x3
         E3Arr = 
        [ 
         {i:front,j:0,k:1},{i:front,j:1,k:2},{i:front,j:2,k:1},{i:front,j:1,k:0},{i:back,j:0,k:1},{i:back,j:1,k:2}, 
		 {i:back,j:2,k:1},{i:back,j:1,k:0},{i:top,j:1,k:0},{i:top,j:1,k:2},{i:down,j:1,k:0},{i:down,j:1,k:2},
         // mapped values
         {i:top,j:2,k:1},{i:right,j:1,k:0},{i:down,j:0,k:1},{i:left,j:1,k:2}, {i:top,j:0,k:1}, {i:left,j:1,k:0},
         {i:down,j:2,k:1},{i:right,j:1,k:2},{i:left,j:0,k:1}, {i:right,j:0,k:1},{i:left,j:2,k:1},{i:right,j:2,k:1} 
         ];
		// corner pieces of 3x3 
		C3Arr = 
		[
		{i:top,j:0,k:0},{i:top,j:0,k:2},{i:top,j:2,k:0},{i:top,j:2,k:2},{i:down,j:0,k:0},{i:down,j:0,k:2},{i:down,j:2,k:0},{i:down,j:2,k:2},
		//mapped values
		{i:back,j:0,k:2},{i:back,j:0,k:0},{i:front,j:0,k:0},{i:front,j:0,k:2},{i:front,j:2,k:0},{i:front,j:2,k:2},{i:back,j:2,k:2},{i:back,j:2,k:0},
		//mapped values
		{i:left,j:0,k:0},{i:right,j:0,k:2},{i:left,j:0,k:2},{i:right,j:0,k:0},{i:left,j:2,k:2},{i:right,j:2,k:0},{i:left,j:2,k:0},{i:right,j:2,k:2}
		];
        
        this.face = "lfrbtd";
        this.colors = colors;
        this.n=0;   //#moves
        this.MoveMap = MoveMap;
        this.InvMoveMap = InvMoveMap;
        this.InvMove = InvMove;
        this.E3Arr = E3Arr;
        this.C3Arr = C3Arr;
        this.savedEdgeArr = savedEdgeArr;
        this.savedCornerArr = savedCornerArr;
        
        this.moves = moves;
        this.moves2 = moves2;
        this.ml = ml;
        this.mlk = mlk;
        this.store = store;
        this.b = b;	// 3x3x3 cube -> 6 * 3 * 3 in dimension
        this.t = t;	// temporary array used in rotate functions
        this.t2 = t2; // temporary array used in rotate functions
        
        this.left = left;   
        this.right = right;   
        this.top = top;   
        this.down = down;   
        this.front = front;   
        this.back = back;   
        this.ck = ck;   
        this.ack = ack;   
        this.col = col;
        
		this.reset_cube();
        this.disp();
    }
        
    reset_saved_pieces()
	{
		this.savedEdgeArr['O'] = 0,this.savedEdgeArr['W'] = 0,this.savedEdgeArr['R'] = 0,
		this.savedEdgeArr['Y'] = 0,this.savedEdgeArr['B'] = 0,this.savedEdgeArr['G'] = 0;
		this.savedCornerArr["B R"] = 0,this.savedCornerArr["B O"] = 0,this.savedCornerArr["G O"] = 0,this.savedCornerArr["G R"] = 0;
	}
	reset_cube()
    {
		var colors = this.colors,i,j,k;
        for( i=0;i<6;i++)
        {
            for( j=0;j<3;j++)
            {
                  for( k=0;k<3;k++)
                {
                    this.b[i][j][k] = colors[i];
                }
            }
        }   
        this.moves = [];
		this.reset_saved_pieces();
        this.states = [];
    }

    clk(k,dim=3)         //rotate kth layer clockwise
    {
        var j;
        for(  j = 0 ; j < dim ; j++ )  // save top
            this.t[j] = this.b[this.top][dim-1-k][j];
        for( j = 0;j<dim;j++)
            this.b[this.top][dim-1-k][dim-1-j] = this.b[this.left][j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.b[this.left][j][dim-1-k] = this.b[this.down][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.down][k][dim-1-j] = this.b[this.right][j][k];
        for( j = 0;j<dim;j++)
            this.b[this.right][j][k] = this.t[j];
    }
     aclk(k,dim=3)        //rotate kth layer anticlockwise
    {
        var j;
        for( j = 0 ; j < dim ; j++ )  // save top
            this.t[j] = this.b[this.top][dim-1-k][j];
        for( j = 0;j<dim;j++)
            this.b[this.top][dim-1-k][j] = this.b[this.right][j][k];
        for( j = 0;j<dim;j++)
            this.b[this.right][dim-1-j][k] = this.b[this.down][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.down][k][j] = this.b[this.left][j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.b[this.left][j][dim-1-k] = this.t[dim-1-j];
    }
    lft(k,dim=3)
    {
        var j;
        for( j = 0 ; j < dim ; j++ )  // save front
            this.t[j] = this.b[this.front][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.front][k][j] = this.b[this.right][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.right][k][j] = this.b[this.back][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.back][k][j] = this.b[this.left][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.left][k][j] = this.t[j];
    }
    rgt(k,dim=3)
    {
        var j;
        for( j = 0 ; j < dim ; j++ )  // save front
            this.t[j] = this.b[this.front][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.front][k][j] = this.b[this.left][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.left][k][j] = this.b[this.back][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.back][k][j] = this.b[this.right][k][j];
        for( j = 0;j<dim;j++)
            this.b[this.right][k][j] = this.t[j];
    }
    up(k,dim=3) // move the kth column up once
    {
        var j;
        for( j = 0;j<dim;j++)  // save front
            this.t[j] = this.b[this.front][j][k];
        for( j = 0;j<dim;j++)
            this.b[this.front][j][k] = this.b[this.down][j][k];
        for( j = 0;j<dim;j++)
            this.b[this.down][j][k] = this.b[this.back][dim-1-j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.b[this.back][j][dim-1-k] = this.b[this.top][dim-1-j][k];
        for( j = 0;j<dim;j++)
            this.b[this.top][j][k] = this.t[j];
    }
    dow(k,dim=3)  // move the kth column down once
    {
        var j;
        for( j = 0;j<dim;j++)  // save front
            this.t[j] = this.b[this.front][j][k];
        for( j = 0;j<dim;j++)
            this.b[this.front][j][k] = this.b[this.top][j][k];
        for( j = 0;j<dim;j++)
            this.b[this.top][j][k] = this.b[this.back][dim-1-j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.b[this.back][j][dim-1-k] = this.b[this.down][dim-1-j][k];
        for( j = 0;j<dim;j++)
            this.b[this.down][j][k] = this.t[j];
    }
    rot(k,anti = false,dim=3) // rotate kth face clockwise or anticlockwise
    {
        var i,j;
        if( anti == false )
            for( i = 0;i<dim;i++)
                for( j = 0;j<dim;j++)
                    this.t2[i][j] = this.b[k][dim-1-j][i];
        else
            for( i = 0;i<dim;i++)
                for( j = 0;j<dim;j++)
                    this.t2[i][j] = this.b[k][j][dim-1-i];
        for( i = 0;i<dim;i++)
            for( j = 0;j<dim;j++)
                this.b[k][i][j] = this.t2[i][j];
    }

	doit(i)
    {
        switch(i)
        {
            case 0:  {   this.dow(2);     this.rot(this.right,true);   if(!noturn)Gcube.twist('r');	break; } //R'
            case 1:  {   this.up(2);      this.rot(this.right);        if(!noturn)Gcube.twist('R');	break; } //R
            case 2:  {   this.up(0);      this.rot(this.left,true);    if(!noturn)Gcube.twist('l');	break; } //L'
            case 3:  {   this.dow(0);     this.rot(this.left);         if(!noturn)Gcube.twist('L');	break; } //L
            case 4:  {   this.rgt(0);     this.rot(this.top,true);     if(!noturn)Gcube.twist('u');	break; } //U'
            case 5:  {   this.lft(0);     this.rot(this.top);          if(!noturn)Gcube.twist('U');	break; } //U
            case 6:  {   this.lft(2);     this.rot(this.down,true);    if(!noturn)Gcube.twist('d');	break; } //D'
            case 7:  {   this.rgt(2);     this.rot(this.down);         if(!noturn)Gcube.twist('D');	break; } //D
            case 8:  {   this.aclk(0);    this.rot(this.front,true);   if(!noturn)Gcube.twist('f');	break; } //F'
            case 9:  {   this.clk(0);     this.rot(this.front);        if(!noturn)Gcube.twist('F');	break; } //F
            case 10: {   this.clk(2);     this.rot(this.back,true);    if(!noturn)Gcube.twist('b');	break; } //B'
            case 11: {   this.aclk(2);    this.rot(this.back);         if(!noturn)Gcube.twist('B');	break; } //B
            case 12: {   this.up(1);	  if(!noturn)Gcube.twist('m');	break; } //M'
            case 13: {   this.dow(1);	  if(!noturn)Gcube.twist('M');	break; } //M
          	case 14: {   this.lft(1);	  if(!noturn)Gcube.twist('E');	break; } //E'	// chrome cube labs have confused E for E'
            case 15: {   this.rgt(1);	  if(!noturn)Gcube.twist('e');	break; } //E
            case 16: {   this.aclk(1);	  if(!noturn)Gcube.twist('s');	break; } //S'
            case 17: {   this.clk(1);	  if(!noturn)Gcube.twist('S');	break; } //S
			case 18: {   this.doit(0);    this.doit(13);   break; }    //r'
			case 19: {   this.doit(1);    this.doit(12);   break; }    //r
            case 20: {   this.doit(2);    this.doit(12);   break; }    //l'
            case 21: {   this.doit(3);    this.doit(13);   break; }    //l
            case 22: {   this.doit(4);    this.doit(15);   break; }    //u'
            case 23: {   this.doit(5);    this.doit(14);   break; }    //u
            case 24: {   this.doit(6);    this.doit(14);   break; }    //d'
            case 25: {   this.doit(7);    this.doit(15);   break; }    //d
            case 26: {   this.doit(8);    this.doit(16);   break; }    //f'
            case 27: {   this.doit(9);    this.doit(17);   break; }    //f
            case 28: {   this.doit(10);   this.doit(17);   break; }    //b'
			case 29: {   this.doit(11);   this.doit(16);   break; }    //b
			case 30: {   this.doit(18);   this.doit(3);   break; }    //X'
			case 31: {   this.doit(19);   this.doit(2);   break; }    //X
			case 32: {   this.doit(22);   this.doit(7);   break; }    //Y'
			case 33: {   this.doit(23);   this.doit(6);   break; }    //Y
			case 34: {   this.doit(26);   this.doit(11);   break; }    //Z'
			case 35: {   this.doit(27);   this.doit(10);   break; }    //Z	
        }
    }
 
    time_delay()  {   for(var time=200000000;time>0;time--);    }
    
    parse(s,inv=false)
    {
        var movesArr = s.split(' ');
        var i,tt,num,l=0,str;
        for(i=0;i<movesArr.length;i++)
        {
            tt = movesArr[i];
			if(tt == "")
				continue;
            this.moves.push(tt);
            if(this.store)  // if store !=0 (i.e solving mode), store move in corresponding layer
                this.ml[this.mlk].push(tt);
			if(!isNaN(tt[0]))
            {                
                num = tt[0]-'0';
				str = tt.substring(1,tt.length);
                if(inv==false)
                    while(num--)
                    {
						this.doit(this.MoveMap[str]);
					}
				else
                    while(num--)
					{
                        this.doit(this.InvMoveMap[str]);
            		}
			}
            else
            {
                 (inv==false) ? this.doit(this.MoveMap[tt]) : this.doit(this.InvMoveMap[tt]);
            }
            this.states.push(this.b_to_string());   // push state after move
            //this.disp();
        }
    }    
    b_to_string()
    {
        var i,j,k,s="";
        for(i=0;i<6;i++)
            for(j=0;j<3;j++)
                for(k=0;k<3;k++)
                   s += this.b[i][j][k];
        return s;
    }
    string_to_b(s)
    {
        var i,j,k,p=0;
        for(i=0;i<6;i++)
            for(j=0;j<3;j++)
                for(k=0;k<3;k++)
                   this.b[i][j][k] = s[p++];
        this.disp();
    }

    look(i)
    {
        switch(i)
        {
            case this.left   : console.log("d U'");   this.parse("d U'");   break;
            case this.front  : break;
            case this.right  :  console.log("d' U"); this.parse("d' U");   break;
            case this.back   : console.log("2d' 2U"); this.parse("2d' 2U"); break;
            case this.top    : console.log("l R'"); this.parse("l R'");   break;
            case this.down   : console.log("l' R"); this.parse("l' R");   break;
            case this.ck     : console.log("f B'"); this.parse("f B'");   break;  // rotate front face Clockwise(whole cube)
            case this.ack    : console.log("f' B"); this.parse("f' B");   break;  // rotate front face Anti-Clockwise(whole cube)
        }
    }
       
    final_layer1(){    this.parse("F R U R' U' F'");     }
    final_layer1A(){   this.parse("F U R U' R' F'");     }
	final_layer2(){   this.parse("R U R' U R 2U R' U");     }
    final_layer2A(){    this.parse("R U R' U R 2U R' 2U u D' R U R' U R 2U R' U");   }
    final_layer3(){    this.parse("U R U' L' U R' U' L");   }
    final_step()  {    this.parse("R' D' R D");     }
    
	white_to_top(color) //  (bring) color center to TOP face
	{
            if(this.b[this.front][1][1] == color)   {   this.look(this.down);  return;  }
            if(this.b[this.left][1][1] == color)    {   this.look(this.ck);    return;  }
            if(this.b[this.right][1][1] == color)   {   this.look(this.ack);   return;  }
            if(this.b[this.back][1][1] == color)    {   this.look(this.top);   return;  }
            if(this.b[this.top][1][1] == color)     return;
            if(this.b[this.down][1][1] == color)    {   this.parse("2r 2L'");  return;}	
	}
	    
	is_center_match(p)	{	return this.b[p.i][p.j][p.k] == this.b[p.i][1][1];	}
	
	is_equal_color(p1,p2)	{	return this.b[p1.i][p1.j][p1.k] == this.b[p2.i][p2.j][p2.k];	}
	
	is_equal_color(p,color)	{	return this.b[p.i][p.j][p.k] == color;	}
	// not used
	E3Map(i)    {	return i<12 ? i+12 : i-12 ;    }
    
	C3Map(i)
    {
		var A=[];
		if(i<8)	A.push(i+8) , A.push(i+16);
		else if(i>=8 && i<16) A.push(i-8) , A.push(i+8);
		else A.push(i-8) , A.push(i-16);
        return A;
    }
    E3Index(ob)
    {
        for(var i=0;i<this.E3Arr.length;i++)
            if(ob.i == this.E3Arr[i].i && ob.j == this.E3Arr[i].j && ob.k == this.E3Arr[i].k)
              return i;
        return -1;
    }
	C3Index(ob)
    {
        for(var i=0;i<this.C3Arr.length;i++)
            if(ob.i == this.C3Arr[i].i && ob.j == this.C3Arr[i].j && ob.k == this.C3Arr[i].k)
              return i;
        return -1;
    }
    other_edge_face(x,y,z)
    {
        var obj = {i:x , j:y , k:z};    var ind = this.E3Index(obj);    var map = this.E3Map(ind);
        return this.E3Arr[map];
    }
	other_corner_faces(x,y,z)
    {
        var obj = {i:x , j:y , k:z};    var ind = this.C3Index(obj);    var maps = this.C3Map(ind);	
		var ret = [	this.C3Arr[maps[0]] , this.C3Arr[maps[1]] ]; 
        return ret;
    }	
    search_edge_color(color)// search edge array for color. only works 4 times ,becoz there are only 4 edges for each color 
    {   
        var E = this.E3Arr,i,j,k,y,o,other_color;
        for(var x=0;x<E.length;x++) 
        {
            y = this.E3Map(x);
            o = E[y];
            other_color = this.b[o.i][o.j][o.k];
            if(this.is_equal_color(E[x],color) && !this.savedEdgeArr[other_color])
            {    this.savedEdgeArr[other_color] = 1;   return E[this.E3Map(x)];       } // return edge if found
        }
    }
	sort_colors(Arr)
	{	// sorts Arr based on color
		var obj =this;	// 
		Arr.sort(function(a,b)
			{
				if(this.b[a.i][a.j][a.k] < this.b[b.i][b.j][b.k])return -1;
				if(this.b[a.i][a.j][a.k] > this.b[b.i][b.j][b.k])return 1;
				return 0;
			}.bind(this));
		return Arr;
	}
    search_corner_color(color)// search corner array for color. only works 4 times ,becoz there are only 4 corners for each color 
    {   
        var C = this.C3Arr , B = this.b,i,j,k,y,o,other_colors , Arr=[];
        console.log("searching for a corner");
		for(var x=0;x<8;x++)	// just search the first 8 elements in C3Arr 
        {
			Arr = [C[x]];
			//take non-white and non-yellow colors and sort them and see if they are visited or not
            other_colors = this.other_corner_faces(C[x].i,C[x].j,C[x].k); Arr.push(other_colors[0]); Arr.push(other_colors[1]);
			Arr = this.sort_colors(Arr);
			var color1 = B[Arr[0].i][Arr[0].j][Arr[0].k], color2 = B[Arr[1].i][Arr[1].j][Arr[1].k], 
			color3 = B[Arr[2].i][Arr[2].j][Arr[2].k];
			console.log("sorted colors of corner piece:"+color1+" "+color2+" "+color3);
			if(color3 == 'Y')
				continue;
			var str = color1+" "+color2;
			if(this.savedCornerArr[str] == 0) // not yet visited => mark as visited and return true
			{
				this.savedCornerArr[str] = 1;
				return Arr;
			}
        }
		return null;
    }
    
    scramble()    
    {     
        this.parse("L R U D B L U F D U U L F D B"); 
        console.log("scrambled"); 
        this.disp();        
    }
      
    check_cross(face,row,col,color)
    {	// helper function for check_l1_cross(), check_l1_cross checks whether white cross is formed or not
        if(this.b[face][row][col] != color) return false;
        var o = this.other_edge_face(face,row,col);
		//check if other side of edge matches with its face center color
		return this.is_center_match(o);
    }
	check_l1_cross()    {   return (this.check_cross(this.top,0,1,'W')&&this.check_cross(this.top,1,0,'W')
							&&this.check_cross(this.top,1,2,'W')&&this.check_cross(this.top,2,1,'W'));   }
    
	check_corners(face)
	{
		var a1,b1,x=0;
		a1 = {i:face,j:0,k:0} , b1 = this.other_corner_faces(a1.i,a1.j,a1.k);
		if(this.is_center_match(a1)&&this.is_center_match(b1[0])&&this.is_center_match(b1[1]))++x;
		a1 = {i:face,j:0,k:2} , b1 = this.other_corner_faces(a1.i,a1.j,a1.k);
		if(this.is_center_match(a1)&&this.is_center_match(b1[0])&&this.is_center_match(b1[1]))++x;
		a1 = {i:face,j:2,k:0} , b1 = this.other_corner_faces(a1.i,a1.j,a1.k);
		if(this.is_center_match(a1)&&this.is_center_match(b1[0])&&this.is_center_match(b1[1]))++x;
		a1 = {i:face,j:2,k:2} , b1 = this.other_corner_faces(a1.i,a1.j,a1.k);
		if(this.is_center_match(a1)&&this.is_center_match(b1[0])&&this.is_center_match(b1[1]))++x;
		return x==4;
	}
	
    bring_free_space_below_front()
    {   // finds free space at bottom (yellow face) for forming cross in layer1 and brings it below front face, if available
        var i = this.down , B = this.b , free = null;
        var a = this.other_edge_face(i,0,1), b = this.other_edge_face(i,1,0), c = this.other_edge_face(i,1,2), d = this.other_edge_face(i,2,1);
        if(B[i][0][1]!='W' && !this.is_equal_color(a,'W'))
            free = {i:i,j:0,k:1} , console.log("already free down");   // no need to rotate to front
        else if(B[i][1][0]!='W' && !this.is_equal_color(b,'W'))
            free = {i:i,j:1,k:0} , this.parse("D") , console.log("D to free");
        else if(B[i][1][2]!='W' && !this.is_equal_color(c,'W'))
            free = {i:i,j:1,k:2} , this.parse("D'") , console.log("D' to free");
        else if(B[i][2][1]!='W' && !this.is_equal_color(d,'W'))
            free = {i:i,j:2,k:1} , this.parse("2D") , console.log("2D to free");
        else
            console.log("sorry no free space down here");
        return free;
    }
    
    rotate_and_match(color) 
    {   // rotates the down face to match with front center color 
        var i = this.down ;
        var a = this.other_edge_face(i,0,1), b = this.other_edge_face(i,1,0), c = this.other_edge_face(i,1,2), d = this.other_edge_face(i,2,1);       
        if(this.b[i][0][1] == color && this.b[a.i][a.j][a.k] == 'W' || this.b[a.i][a.j][a.k] == color && this.b[i][0][1] == 'W')
        {  console.log(a); console.log("no need to rotate and match");    return; }
        if(this.b[i][1][0] == color && this.b[b.i][b.j][b.k] == 'W' || this.b[b.i][b.j][b.k] == color && this.b[i][1][0] == 'W')
        {  console.log(b);this.parse("D"); console.log("D to rotate and match");    return; }
        if(this.b[i][1][2] == color && this.b[c.i][c.j][c.k] == 'W' || this.b[c.i][c.j][c.k] == color && this.b[i][1][2] == 'W')
        {  console.log(c); this.parse("D'"); console.log("D' to rotate and match");    return; }
        if(this.b[i][2][1] == color && this.b[d.i][d.j][d.k] == 'W' || this.b[d.i][d.j][d.k] == color && this.b[i][2][1] == 'W')
        { console.log(d);  this.parse("2D");console.log("2D to rotate and match"); }
        
    }
    
	get_side_face(Arr)
	{
		if(Arr[0].i<4)
			return Arr[0];
		if(Arr[1].i<4)
			return Arr[1];
		return Arr[2];
	}
	
	position_down_right_appropriately(Car)
	{
		console.log("positioning down:");
		var c11 = this.b[Car[0].i][Car[0].j][Car[0].k],c22 = this.b[Car[1].i][Car[1].j][Car[1].k],c33 = this.b[Car[2].i][Car[2].j][Car[2].k];
		console.log("input is:"+c11+" , "+c22+" , "+c33);
		var c1,c2,c3,t,C;	// colors
		for(var i=0;i<4;i++)
		{ 
			c1 = this.b[Car[0].i][1][1], c2 = this.b[Car[1].i][1][1], c3 = this.b[Car[2].i][1][1];
			C = [c1,c2,c3];
			C.sort(function(a,b)
			{
				if(a < b)return -1;
				if(a > b)return 1;
				return 0;
			});
			console.log("centers are (not respectively matching):"+C[0]+" , "+C[1]+" , "+C[2]);
			if(this.is_equal_color(Car[0],C[0]) && this.is_equal_color(Car[1],C[1]) )
			{
				console.log("colors match");
				return;
			}
			this.parse("u");
			console.log("u");
		}
	}
	
	white_cross()
	{
		var i  , ed , other_face , face1 , face2, nt_face,nt_edge;
		for(i=0;i<4;i++)
        {
            ed = this.search_edge_color('W');    // find white edge
            console.log("ed="+ed.i+","+ed.j+","+ed.k);
            // find both faces of it
            other_face = this.other_edge_face(ed.i,ed.j,ed.k);
            face1 = ed.i;   face2 = other_face.i;
            if(face1 == this.down || face2 == this.down)//if any face is down do nothing
            {   console.log("already down machi!"); continue;   }
            nt_face = face1 , nt_edge = ed;
            if(face1 == this.top)
                nt_face = face2 , nt_edge = other_face; 
            console.log("non-top face of"+ed.i+" and "+other_face.i+" is: "+nt_face);
            this.look(nt_face); // make the non-top face as front face
            this.bring_free_space_below_front(); 
            console.log("looking at that face and also brought free space down front");
            if(nt_edge.j == 0)          // bring the white edge down
                this.parse("2F") , console.log("2F to bring it down");
            else if(nt_edge.j == 1)
            {
                if(nt_edge.k == 0)
                    this.parse("F'") , console.log("F' to bring it down");
                else
                    this.parse("F") , console.log("F to bring it down");
            }
            console.log("brought an edge down");
        }
        // front face is nt_face
        console.log("b4 the movement, nt_face="+nt_face);
        for(i=0;i<4;i++)
        {
            nt_face=this.front;
            console.log("nt_face="+nt_face);
            var front_color = this.b[nt_face][1][1];
            console.log("front color="+front_color);
            
            this.rotate_and_match(front_color);
            this.parse("2F");
            console.log("2F to bring it up");
            if(this.b[this.front][0][1] == 'W')
                this.parse("F' U L' U' L D' L'") , console.log("F' U L' U' L D' L' done to reorient edge");
            this.look(this.right);
        }
	//	this.moves.push("white cross done");
		console.log("------------------------------------------------------------");
	}
	
	white_corners()
	{	
		var i;
		for(i=0;i<4;i++)
		{
			var Car = this.search_corner_color('W');
			console.log("corner: "+Car[0].i+","+Car[0].j+","+Car[0].k+" & "+Car[1].i+","+Car[1].j+","+Car[1].k+" & "+Car[2].i+","+Car[2].j+","+Car[2].k);
			if( this.is_center_match(Car[0]) && this.is_center_match(Car[1]) && this.is_center_match(Car[2]) )
			{	console.log("already this corner is in place!");	 continue;	}
			var s_face = this.get_side_face(Car);
			console.log("side face= "+s_face.i);
			if(s_face.k == 2)
				this.look(s_face.i);
			else
				this.look(s_face.i) , this.look(this.left);
			console.log("looking at that face: where cube @ right"+s_face.i);
			if(s_face.j == 0) // corner at the top row
			{
				console.log("@ top");
				this.final_step();	console.log("R' D' R D done");	// bring it to down right
			}
			else	// corner at the bottom row
				console.log("@ bottom");
			console.log("cube at bottom right");
			var f = [{i:this.front,j:2,k:2}] , other = this.other_corner_faces(f[0].i,f[0].j,f[0].k); 
			f.push(other[0]); f.push(other[1]);
			f = this.sort_colors(f);
			this.position_down_right_appropriately(f);
			
			if(this.b[f[2].i][f[2].j][f[2].k] != 'W')
				console.log("error! the 3rd face of corner piece isn't white da!");
			
			if(f[2].i == this.down)
			{	console.log("W @ down => do R' D' R D, 3 times"); this.final_step(); this.final_step(); this.final_step();	}
			else if(f[2].i == this.right)
			{	console.log("W @ right => do R' D' R D once"); this.final_step();	}
			else	// front
			{	console.log("W @ front => do D' R' D R"); this.parse("D' R' D R");	}
			console.log("corner placed successfully");
		}
	}
	
	layer1()
    {
		this.reset_saved_pieces();
	//	this.moves.push("layer1");
		console.log("Layer1:");
		console.log("------------------------------------------------------------");
        this.white_to_top('W');
        console.log("brought white center at top");
        if(this.check_l1_cross())
			console.log("white cross already done!");
        else 
			this.white_cross(this.top);
        if(this.check_corners(this.top))
			console.log("white corners already done!");
        else 
			this.white_corners();
		console.log("---------------------------LAYER 1 OVER------------------------------");
	}
	
	count_middle_matching_edges()
	{
		var e,o,x=0;
		e = {i:this.front,j:1,k:0} , o = this.other_edge_face(e.i,e.j,e.k);
		if(this.is_center_match(e) && this.is_center_match(o)) x++;
		e = {i:this.front,j:1,k:2} , o = this.other_edge_face(e.i,e.j,e.k);
		if(this.is_center_match(e) && this.is_center_match(o)) x++;
		e = {i:this.back,j:1,k:0} , o = this.other_edge_face(e.i,e.j,e.k);
		if(this.is_center_match(e) && this.is_center_match(o)) x++;
		e = {i:this.back,j:1,k:2} , o = this.other_edge_face(e.i,e.j,e.k);
		if(this.is_center_match(e) && this.is_center_match(o)) x++;
		return x;
	}
	
	search_top_non_yellow_edges()
	{
		var e,o;
		e = {i:this.top,j:0,k:1} , o = this.other_edge_face(e.i,e.j,e.k);
		if(!this.is_equal_color(e,'Y')  && !this.is_equal_color(o,'Y')) 
			return (e.i != this.top) ? e : o;
		e = {i:this.top,j:1,k:0} , o = this.other_edge_face(e.i,e.j,e.k);
		if(!this.is_equal_color(e,'Y')  && !this.is_equal_color(o,'Y')) 
			return (e.i != this.top) ? e : o;		
		e = {i:this.top,j:1,k:2} , o = this.other_edge_face(e.i,e.j,e.k);
		if(!this.is_equal_color(e,'Y')  && !this.is_equal_color(o,'Y')) 
			return (e.i != this.top) ? e : o;
		e = {i:this.top,j:2,k:1} , o = this.other_edge_face(e.i,e.j,e.k);
		if(!this.is_equal_color(e,'Y')  && !this.is_equal_color(o,'Y')) 
			return (e.i != this.top) ? e : o;
		return null;
	}
	
	opp_color(color)
	{
		switch (color)
		{
			case 'R' : return 'O';
			case 'O' : return 'R';
			case 'W' : return 'Y';
			case 'Y' : return 'W';
			case 'G' : return 'B';
			case 'B' : return 'G';
		}
	}
	
	layer2()
	{
		this.reset_saved_pieces();
		//this.moves.push("layer2");
		console.log("Layer2:");
		console.log("------------------------------------------------------------");
        this.parse("2r 2L'");
        console.log("turn white face down => 2r 2L'");
		var i = this.count_middle_matching_edges();
		var e,top_color,oppa_top_color;
		console.log("already, there are "+i+" matching edges");
		for(;i<4;)
		{
			console.log("search top");
			e = this.search_top_non_yellow_edges();
			if(!e)
			{
				console.log("no non-yellow edges @ top so do:");
				for(var j=0;j<4;j++)
					if(this.is_center_match({i:this.front,j:1,k:0}) && this.is_center_match({i:this.left,j:1,k:2}))
						this.look(this.right);
					else
						break;
				this.parse("L' U' L U F U F'");
				console.log("L' U' L U F U F'");
				continue;	// 'i' isn't incremented here
			}
			console.log("found a non-yellow edge: "+e.i+","+e.j+","+e.k);
			this.look(e.i);
			for(var j=0;j<4;j++)
				if(this.is_center_match({i:this.front,j:0,k:1}))
					break;
				else
					console.log("d") , this.parse("d");
			console.log("matched with center");
			top_color = this.b[this.top][2][1];
			oppa_top_color = this.opp_color(top_color);
			if(this.b[this.right][1][1] == oppa_top_color)
				console.log("U' L' U L U F U' F'"),	this.parse("U' L' U L U F U' F'");
			else
				console.log("U R U' R' U' F' U F"), this.parse("U R U' R' U' F' U F");
			i++;
		}
		console.log("---------------------------LAYER 2 OVER------------------------------");
	}
	
	search_top_yellow_edges()
	{
		var A = [ {i:this.top,j:0,k:1} , {i:this.top,j:1,k:0} , {i:this.top,j:1,k:2} , {i:this.top,j:2,k:1} ];
		if(this.is_equal_color(A[0],'Y') && this.is_equal_color(A[1],'Y') && this.is_equal_color(A[2],'Y') && this.is_equal_color(A[3],'Y'))
		{console.log("all 4 are yellow @ top"); return 4;}
		if( !this.is_equal_color(A[0],'Y') && !this.is_equal_color(A[1],'Y') && !this.is_equal_color(A[2],'Y') && !this.is_equal_color(A[3],'Y'))
		{console.log("none are yellow @ top"); return 0;}
		for(var i=0;i<4;i++)
		{
			if(this.is_equal_color(A[0],'Y') && this.is_equal_color(A[1],'Y'))  // inverted L
			{console.log("inverted L shape Y @ top"); return 2;}
			if(this.is_equal_color(A[1],'Y') && this.is_equal_color(A[2],'Y'))  // horizontal
			{console.log("horizontal Y @ top"); return 3;}
			console.log("U") , this.parse("U");
		}
	}	
	
	search_corner_proper_place()
	{
		var f,c1,c2,c3,C,ret=[],other;
		for(var fac = this.left;fac<=this.back; fac++)
		{
			f = [{i:fac,j:0,k:0}] , other = this.other_corner_faces(f[0].i,f[0].j,f[0].k); 
			f.push(other[0]); f.push(other[1]);
			f = this.sort_colors(f);
			c1 = this.b[f[0].i][1][1], c2 = this.b[f[1].i][1][1], c3 = this.b[f[2].i][1][1];
			C = [c1,c2,c3];
			C.sort(function(a,b)
			{
				if(a < b)return -1;
				if(a > b)return 1;
				return 0;
			});
			console.log("f:"+f[0].i+","+f[0].j+","+f[0].k+" & "+f[1].i+","+f[1].j+","+f[1].k+" & "+f[2].i+","+f[2].j+","+f[2].k);
			console.log("C:"+C[0]+" & "+C[1]+" & "+C[2]);			
			if(this.is_equal_color(f[0],C[0]) && this.is_equal_color(f[1],C[1]) && this.is_equal_color(f[2],C[2]))
			{console.log("match");  ret.push(f);}
		}
		console.log(ret);
		return ret;
	}
	// assuming yellow @ top
	check_l3_cross_not_strict()
	{
		return (this.b[this.top][0][1] == 'Y'&&this.b[this.top][1][0] == 'Y'&&this.b[this.top][1][2] == 'Y'&&this.b[this.top][2][1] == 'Y');
	}
	
	
	layer3()
	{
		this.reset_saved_pieces();
		//this.moves.push("layer3");
		console.log("Layer3:");
		console.log("------------------------------------------------------------");
        if(this.b[this.down][1][1]!='W')
			this.white_to_top('Y');
		
		var n = this.search_top_yellow_edges() , i , k;
		if(n == 0)	// dot
			console.log("F R U R' U' F' f R U R' U' f'") , this.parse("F R U R' U' F' f R U R' U' f'");
		else if(n == 2)// inverted L
			console.log("F U R U' R' F'") , this.final_layer1A();
		else if(n == 3) // horizontal Y
			console.log("F R U R' U' F'") , this.final_layer1();
		// if n == 4 no need to do above step
		
		k=0;
		for(;k<4;k++)
		{
			n=0;
			for(var i=this.left;i<=this.back;i++)
				if(this.b[i][0][1] == this.b[i][1][1])
					n++;
			if(n>=2)
				break;
			console.log("U") , this.parse("U");
		}
		if(k==4)
		{
			console.log("n<2 error");
		}
		console.log("there are now >= 2 matching edges @ top");
		if(n<4)
			for(i=0;i<4;i++)
			{
				if( this.is_center_match({i:this.left,j:0,k:1}) && this.is_center_match({i:this.right,j:0,k:1}) )	// horizontal
				{console.log("horizontal match, do R U R' U R 2U R' 2U u D' R U R' U R 2U R' U"); this.final_layer2A(); break;}
				
				if( this.is_center_match({i:this.back,j:0,k:1}) && this.is_center_match({i:this.right,j:0,k:1}) )	// right and back	
				{console.log("back and right match, do R U R' U R 2U R' U"); this.final_layer2(); break;}
				this.look(this.right); //  no shape found => look right
			}
		// if n == 4 => no need of above steps		
		console.log("edges matching now");		
		k=0;
		var cornerArr,fac,o;
		var num=0;
		while(true)
		{
			cornerArr = this.search_corner_proper_place();
			if(cornerArr.length == 0)
			{
				console.log("no proper corner found so do U R U' L' U R' U' L and try again");
				this.final_layer3();
				continue;
			}
			console.log("corner found");
			console.log("corner1= "+cornerArr[0][0].i+" , "+cornerArr[0][0].j+" , "+cornerArr[0][0].k);
			if(cornerArr.length == 4)
			{
				console.log("all corner in proper position");
				break;
			}
			else if(cornerArr.length == 1 || (cornerArr.length == 2 ))
			{
				o = this.other_corner_faces(cornerArr[0][0].i,cornerArr[0][0].j,cornerArr[0][0].k);
					
				if(cornerArr[0][0].i == this.top)
				{
					(o[0].k == 0) ? this.look(o[1].i) :  this.look(o[0].i);
				}
				else
				{
					if(cornerArr[0][0].k == 2)
						this.look(cornerArr[0][0].i);
					else if(o[0].i != this.top && o[0].k == 2)
						this.look(o[0].i);
					else
						this.look(o[1].i);
					//(cornerArr[0][0].k == 2) ? this.look(o[1].i) :  this.look(o[0].i);
				}
				console.log("corner at top right now => do U R U' L' U R' U' L");
				this.final_layer3();
			}
			else
			{
				console.log("error! wrong number of proper corners");
			}
			if(++num >4)
			{
				console.log("ERROR! corners searched 4 times.. breaking from loop");
				 break;
			}
		}
		console.log("corners in are position! Now, for the final step");
		if(this.check_corners(this.top))
			console.log("corners already done!");
        else
		{		
			num=0;
			for(var i=0;i<4;i++)
			{	
				num=0;
				while(this.b[this.top][2][2] != 'Y' && num++ <6)
					console.log("R' D' R D") ,this.final_step();
				console.log("U");	this.parse("U");
			}
		}
		console.log("---------------------------LAYER 3 OVER------------------------------");	
	}
	
	solve3x3()
	{
        this.moves = [];	// empty moves array before solving
        this.moves.push("initial");
        this.states = [];
        
        this.states.push(this.b_to_string());   // push initial state
		this.ml = new Array(3);
        for(var i=0;i<3;i++)
            this.ml[i] = new Array();
        this.store = 1;
        this.mlk = 0;   // store all moves of 1st layer in index 0;
        this.layer1();
        this.mlk = 1;   // store all moves of 2nd layer in index 1;
		this.layer2();
        this.mlk = 2;   // store all moves of 3rd layer in index 2;
		this.layer3();
		
        console.log(this.ml[0].toString());
        console.log(this.ml[1].toString());
        console.log(this.ml[2].toString());
        console.log("optimising...");
		this.moves2 = this.optimise(this.moves);
		
        this.ml[0] = this.optimise(this.ml[0]);
		this.ml[1] = this.optimise(this.ml[1]);
		this.ml[2] = this.optimise(this.ml[2]);
		
		console.log("moves length="+this.moves.length+" moves2 length="+this.moves2.length);
        console.log("solved!");
        console.log(this.ml[0].toString());
        console.log(this.ml[1].toString());
        console.log(this.ml[2].toString());
        this.store = 0;
	}
	getnum(sym)
	{

		if(!isNaN(sym[0]))	// assumption : only 1 digit number at maximum
			return { n : sym[0]-'0', s : sym.substring(1,sym.length) };
		return { n : 1, s : sym };
	}

	foo(sym,num,moves2)
	{
		switch(num % 4)
		{
			case 0 : break;
			case 1 : moves2.push(sym); break;
			case 2 : moves2.push('2' + sym); break;
			case 3 : moves2.push(this.InvMove[this.InvMoveMap[sym]]); break;
			case -1 : moves2.push(this.InvMove[this.InvMoveMap[sym]]); break;
			case -2 : moves2.push('2' + this.InvMove[this.InvMoveMap[sym]]); break;
			case -3 : moves2.push(sym); break;
		}
	}

	optimise(moves)
	{
		var moves2 = ['initial'];
		var i,j,k,num,sym,mv1,mv2;
		var obj,f=0;
		for( i=0;i<moves.length;i++)
		{
			mv1 = this.getnum(moves[i]); num = mv1.n;	sym = mv1.s;
			//console.log("num="+num+" sym="+sym+" i="+i);
			for(j=i+1,k=0;j < moves.length;j++,k++)
			{
				mv2 = this.getnum(moves[j]);
				//console.log("mv2.n="+mv2.n+" mv2.s="+mv2.s+" j="+j);
				if(mv2.s == sym )
					num += mv2.n;	
				else if(mv2.s == this.InvMove[this.InvMoveMap[sym]])
					num -= mv2.n;
				else
					break;
			}
			this.foo(sym,num,moves2);
			i += k;
		}
        return moves2;
	}


	disp()
	{
		
	}

}
//-------------------------------------END OF CLASS CUBE----------------------------------------//