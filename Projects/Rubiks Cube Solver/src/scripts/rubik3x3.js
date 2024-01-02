	
/*
	my moves notation is mapped with chrome cube labs' notation in doit() function in Rcube
*/

class Rcube
{
	
    constructor(cube)
    {
		Gcube = cube;
		let i,j;
        let store=0;
        let MoveMap=[],InvMoveMap=[],EdgePieceArr=[],CornerPieceArr=[],savedEdgeArr=[],savedCornerArr=[];      
        let left=0,front=1,right=2,back=3,top=4,down=5,ck=6,ack=7;    
        let col = [];	// for coloring tiles in css
        col["O"]="orange";col["W"]="white";col["R"]="red";col["Y"]="yellow";col["B"]="blue";col["G"]="green";
        let moves = new Array();    // store moves
        let moves2 = new Array();    // store optimized moves
		
        let solution_moves_list = new Array(3); // store solution moves layerwise
        let b = new Array(6); /* 3d array (here, defining 1st dimension)*/
        let t = new Array(), t2 = new Array();
        for(i=0;i<4;i++)
            t2[i] = new Array();
        
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
        let InvMove = [
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
        EdgePieceArr = 
        [ 
         {i:front,j:0,k:1},{i:front,j:1,k:2},{i:front,j:2,k:1},{i:front,j:1,k:0},{i:back,j:0,k:1},{i:back,j:1,k:2}, 
		 {i:back,j:2,k:1},{i:back,j:1,k:0},{i:top,j:1,k:0},{i:top,j:1,k:2},{i:down,j:1,k:0},{i:down,j:1,k:2},
         // mapped values
         {i:top,j:2,k:1},{i:right,j:1,k:0},{i:down,j:0,k:1},{i:left,j:1,k:2}, {i:top,j:0,k:1}, {i:left,j:1,k:0},
         {i:down,j:2,k:1},{i:right,j:1,k:2},{i:left,j:0,k:1}, {i:right,j:0,k:1},{i:left,j:2,k:1},{i:right,j:2,k:1} 
         ];
		// corner pieces of 3x3 
		CornerPieceArr = 
		[
		{i:top,j:0,k:0},{i:top,j:0,k:2},{i:top,j:2,k:0},{i:top,j:2,k:2},{i:down,j:0,k:0},{i:down,j:0,k:2},{i:down,j:2,k:0},{i:down,j:2,k:2},
		//mapped values
		{i:back,j:0,k:2},{i:back,j:0,k:0},{i:front,j:0,k:0},{i:front,j:0,k:2},{i:front,j:2,k:0},{i:front,j:2,k:2},{i:back,j:2,k:2},{i:back,j:2,k:0},
		//mapped values
		{i:left,j:0,k:0},{i:right,j:0,k:2},{i:left,j:0,k:2},{i:right,j:0,k:0},{i:left,j:2,k:2},{i:right,j:2,k:0},{i:left,j:2,k:0},{i:right,j:2,k:2}
		];
        
        this.face = "lfrbtd";
        this.colors = "GWBYOR";
        this.n=0;   //#moves
        this.MoveMap = MoveMap;
        this.InvMoveMap = InvMoveMap;
        this.InvMove = InvMove;
        this.EdgePieceArr = EdgePieceArr;
        this.CornerPieceArr = CornerPieceArr;
        this.savedEdgeArr = savedEdgeArr;
        this.savedCornerArr = savedCornerArr;
        
        this.moves = moves;
        this.moves2 = moves2;
        this.solution_moves_list = solution_moves_list;
        this.solution_layer = 0;
        this.store = store;
        this.rubiksCube = b;	// 3x3x3 cube -> 6 * 3 * 3 in dimension
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
		// Use const for variables that don't change
		this.defaultDimension = 3;
		this.move_descriptions = new Array(3);// store move descriptions

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
        for(let i=0;i<6;i++)
        {
            for(let j=0;j<3;j++)
            {
                for(let k=0;k<3;k++)
                {
                    this.rubiksCube[i][j][k] = this.colors[i];
                }
            }
        }   
        this.moves = [];
		this.reset_saved_pieces();
        this.states = [];
    }

    clk(k,dim=3)         //rotate kth layer clockwise
    {
        let j;
        for(  j = 0 ; j < dim ; j++ )  // save top
            this.t[j] = this.rubiksCube[this.top][dim-1-k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.top][dim-1-k][dim-1-j] = this.rubiksCube[this.left][j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.left][j][dim-1-k] = this.rubiksCube[this.down][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.down][k][dim-1-j] = this.rubiksCube[this.right][j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.right][j][k] = this.t[j];
    }
     aclk(k,dim=3)        //rotate kth layer anticlockwise
    {
        let j;
        for( j = 0 ; j < dim ; j++ )  // save top
            this.t[j] = this.rubiksCube[this.top][dim-1-k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.top][dim-1-k][j] = this.rubiksCube[this.right][j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.right][dim-1-j][k] = this.rubiksCube[this.down][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.down][k][j] = this.rubiksCube[this.left][j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.left][j][dim-1-k] = this.t[dim-1-j];
    }
    lft(k,dim=3)
    {
        let j;
        for( j = 0 ; j < dim ; j++ )  // save front
            this.t[j] = this.rubiksCube[this.front][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.front][k][j] = this.rubiksCube[this.right][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.right][k][j] = this.rubiksCube[this.back][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.back][k][j] = this.rubiksCube[this.left][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.left][k][j] = this.t[j];
    }
    rgt(k,dim=3)
    {
        let j;
        for( j = 0 ; j < dim ; j++ )  // save front
            this.t[j] = this.rubiksCube[this.front][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.front][k][j] = this.rubiksCube[this.left][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.left][k][j] = this.rubiksCube[this.back][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.back][k][j] = this.rubiksCube[this.right][k][j];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.right][k][j] = this.t[j];
    }
    up(k,dim=3) // move the kth column up once
    {
        let j;
        for( j = 0;j<dim;j++)  // save front
            this.t[j] = this.rubiksCube[this.front][j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.front][j][k] = this.rubiksCube[this.down][j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.down][j][k] = this.rubiksCube[this.back][dim-1-j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.back][j][dim-1-k] = this.rubiksCube[this.top][dim-1-j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.top][j][k] = this.t[j];
    }
    dow(k,dim=3)  // move the kth column down once
    {
        let j;
        for( j = 0;j<dim;j++)  // save front
            this.t[j] = this.rubiksCube[this.front][j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.front][j][k] = this.rubiksCube[this.top][j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.top][j][k] = this.rubiksCube[this.back][dim-1-j][dim-1-k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.back][j][dim-1-k] = this.rubiksCube[this.down][dim-1-j][k];
        for( j = 0;j<dim;j++)
            this.rubiksCube[this.down][j][k] = this.t[j];
    }
    rot(k,anti = false,dim=3) // rotate kth face clockwise or anticlockwise
    {
        let i,j;
        if( anti == false )
            for( i = 0;i<dim;i++)
                for( j = 0;j<dim;j++)
                    this.t2[i][j] = this.rubiksCube[k][dim-1-j][i];
        else
            for( i = 0;i<dim;i++)
                for( j = 0;j<dim;j++)
                    this.t2[i][j] = this.rubiksCube[k][j][dim-1-i];
        for( i = 0;i<dim;i++)
            for( j = 0;j<dim;j++)
                this.rubiksCube[k][i][j] = this.t2[i][j];
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
 
	get_move_description(num, inv, moveType) {
		// console.log("num=",num, ",inv=",inv,",moveType=",moveType);
		const retstr = `Rotate ${moveType} ${!inv?"clockwise":"anticlockwise"} ${num} times`;
		return retstr;
	}
    
    parse(s,inv=false)
    {
		if(s=== 'initial') {
			return;
		}
        const movesArr = s?.split(' ');
        let i,tt,num,str;
        for(i=0;i<movesArr?.length;i++)
        {
            tt = movesArr[i];
			if(!tt.length)
				continue;
            this.moves.push(tt);
            if(this.store)  // if store !=0 (i.e solving mode), store move in corresponding layer
                this.solution_moves_list[this.solution_layer].push(tt);
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
            this.states.push(this.saveCubeStateToString());   // push state after move
            //this.disp();
        }
    }    
    saveCubeStateToString()
    {
        let s="";
        for(let i=0;i<6;i++)
            for(let j=0;j<3;j++)
                for(let k=0;k<3;k++)
                   s += this.rubiksCube[i][j][k];
        return s;
    }
    loadCubeStateFromString(s)
    {
        let p=0;
        for(let i=0;i<6;i++)
            for(let j=0;j<3;j++)
                for(let k=0;k<3;k++)
                   this.rubiksCube[i][j][k] = s[p++];
        this.disp();
    } 

    look(i)
    {
        switch(i)
        {
            case this.left   : this.parse("d U'");   break;
            case this.front  : break;
            case this.right  : this.parse("d' U");   break;
            case this.back   : this.parse("2d' 2U"); break;
            case this.top    : this.parse("l R'");   break;
            case this.down   : this.parse("l' R");   break;
            case this.ck     : this.parse("f B'");   break;  // rotate front face Clockwise(whole cube)
            case this.ack    : this.parse("f' B");   break;  // rotate front face Anti-Clockwise(whole cube)
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
            if(this.rubiksCube[this.front][1][1] === color)   {   this.look(this.down);  return;  }
            if(this.rubiksCube[this.left][1][1] === color)    {   this.look(this.ck);    return;  }
            if(this.rubiksCube[this.right][1][1] === color)   {   this.look(this.ack);   return;  }
            if(this.rubiksCube[this.back][1][1] === color)    {   this.look(this.top);   return;  }
            if(this.rubiksCube[this.top][1][1] === color)     return;
            if(this.rubiksCube[this.down][1][1] === color)    {   this.parse("2r 2L'");  return;}	
	}
	    
	is_center_match(p)	{	return this.rubiksCube[p.i][p.j][p.k] == this.rubiksCube[p.i][1][1];	}
	
	is_equal_color(p1,p2)	{	return this.rubiksCube[p1.i][p1.j][p1.k] == this.rubiksCube[p2.i][p2.j][p2.k];	}
	
	is_equal_color(p,color)	{	return this.rubiksCube[p.i][p.j][p.k] == color;	}
	// not used
	EdgeMap(i)    {	return i<12 ? i+12 : i-12 ;    }
    
	CornerMap(i)
    {
		let A=[];
		if(i<8)	A.push(i+8) , A.push(i+16);
		else if(i>=8 && i<16) A.push(i-8) , A.push(i+8);
		else A.push(i-8) , A.push(i-16);
        return A;
    }
    EdgeIndex(ob)
    {
        for(let i=0;i<this.EdgePieceArr.length;i++)
            if(ob.i == this.EdgePieceArr[i].i && ob.j == this.EdgePieceArr[i].j && ob.k == this.EdgePieceArr[i].k)
              return i;
        return -1;
    }
	CornerIndex(ob)
    {
        for(let i=0;i<this.CornerPieceArr.length;i++)
            if(ob.i == this.CornerPieceArr[i].i && ob.j == this.CornerPieceArr[i].j && ob.k == this.CornerPieceArr[i].k)
              return i;
        return -1;
    }
    other_edge_face(x,y,z)
    {
        let obj = {i:x , j:y , k:z};    let ind = this.EdgeIndex(obj);    let map = this.EdgeMap(ind);
        return this.EdgePieceArr[map];
    }
	other_corner_faces(x,y,z)
    {
        let obj = {i:x , j:y , k:z};    let ind = this.CornerIndex(obj);    let maps = this.CornerMap(ind);	
		let ret = [	this.CornerPieceArr[maps[0]] , this.CornerPieceArr[maps[1]] ]; 
        return ret;
    }	
    search_edge_color(color)// search edge array for color. only works 4 times ,becoz there are only 4 edges for each color 
    {   
        let E = this.EdgePieceArr,i,j,k,y,o,other_color;
        for(let x=0;x<E.length;x++) 
        {
            y = this.EdgeMap(x);
            o = E[y];
            other_color = this.rubiksCube[o.i][o.j][o.k];
            if(this.is_equal_color(E[x],color) && !this.savedEdgeArr[other_color])
            {    this.savedEdgeArr[other_color] = 1;   return E[this.EdgeMap(x)];       } // return edge if found
        }
    }
	sort_colors(Arr)
	{	// sorts Arr based on color
		let obj =this;	// 
		Arr.sort(function(a,b)
			{
				if(this.rubiksCube[a.i][a.j][a.k] < this.rubiksCube[b.i][b.j][b.k])return -1;
				if(this.rubiksCube[a.i][a.j][a.k] > this.rubiksCube[b.i][b.j][b.k])return 1;
				return 0;
			}.bind(this));
		return Arr;
	}
    search_corner_color(color)// search corner array for color. only works 4 times ,becoz there are only 4 corners for each color 
    {   
        let C = this.CornerPieceArr , B = this.rubiksCube,i,j,k,y,o,other_colors , Arr=[];
        console.log("searching for a corner");
		for(let x=0;x<8;x++)	// just search the first 8 elements in CornerPieceArr 
        {
			Arr = [C[x]];
			//take non-white and non-yellow colors and sort them and see if they are visited or not
            other_colors = this.other_corner_faces(C[x].i,C[x].j,C[x].k); Arr.push(other_colors[0]); Arr.push(other_colors[1]);
			Arr = this.sort_colors(Arr);
			let color1 = B[Arr[0].i][Arr[0].j][Arr[0].k], color2 = B[Arr[1].i][Arr[1].j][Arr[1].k], 
			color3 = B[Arr[2].i][Arr[2].j][Arr[2].k];
			console.log("sorted colors of corner piece:"+color1+" "+color2+" "+color3);
			if(color3 == 'Y')
				continue;
			let str = color1+" "+color2;
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
        if(this.rubiksCube[face][row][col] != color) return false;
        let o = this.other_edge_face(face,row,col);
		//check if other side of edge matches with its face center color
		return this.is_center_match(o);
    }
	check_l1_cross()    {   return (this.check_cross(this.top,0,1,'W')&&this.check_cross(this.top,1,0,'W')
							&&this.check_cross(this.top,1,2,'W')&&this.check_cross(this.top,2,1,'W'));   }
    
	check_corners(face)
	{
		let a1,b1,x=0;
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
        let i = this.down , B = this.rubiksCube , free = null;
        let a = this.other_edge_face(i,0,1), b = this.other_edge_face(i,1,0), c = this.other_edge_face(i,1,2), d = this.other_edge_face(i,2,1);
        if(B[i][0][1]!='W' && !this.is_equal_color(a,'W')){
			free = {i:i,j:0,k:1};
			console.log("already free down");   // no need to rotate to front
			this.record_move("Already there is a free space in the down face to create a cross ")
		}
        else if(B[i][1][0]!='W' && !this.is_equal_color(b,'W')) {

			free = {i:i,j:1,k:0} , this.parse("D") , console.log("D to free");
		}
        else if(B[i][1][2]!='W' && !this.is_equal_color(c,'W')){

            free = {i:i,j:1,k:2} , this.parse("D'") , console.log("D' to free");
		}
        else if(B[i][2][1]!='W' && !this.is_equal_color(d,'W')) {

			free = {i:i,j:2,k:1} , this.parse("2D") , console.log("2D to free");
		}
        else {

            console.log("sorry no free space down here");
		}
        return free;
    }
    
    rotate_and_match(color) 
    {   // rotates the down face to match with front center color 
        let i = this.down ;
        let a = this.other_edge_face(i,0,1), b = this.other_edge_face(i,1,0), c = this.other_edge_face(i,1,2), d = this.other_edge_face(i,2,1);       
        if(this.rubiksCube[i][0][1] == color && this.rubiksCube[a.i][a.j][a.k] == 'W' || this.rubiksCube[a.i][a.j][a.k] == color && this.rubiksCube[i][0][1] == 'W')
        {  console.log(a); console.log("no need to rotate and match");    return; }
        if(this.rubiksCube[i][1][0] == color && this.rubiksCube[b.i][b.j][b.k] == 'W' || this.rubiksCube[b.i][b.j][b.k] == color && this.rubiksCube[i][1][0] == 'W')
        {  console.log(b);this.parse("D"); console.log("D to rotate and match");    return; }
        if(this.rubiksCube[i][1][2] == color && this.rubiksCube[c.i][c.j][c.k] == 'W' || this.rubiksCube[c.i][c.j][c.k] == color && this.rubiksCube[i][1][2] == 'W')
        {  console.log(c); this.parse("D'"); console.log("D' to rotate and match");    return; }
        if(this.rubiksCube[i][2][1] == color && this.rubiksCube[d.i][d.j][d.k] == 'W' || this.rubiksCube[d.i][d.j][d.k] == color && this.rubiksCube[i][2][1] == 'W')
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
		let c11 = this.rubiksCube[Car[0].i][Car[0].j][Car[0].k],c22 = this.rubiksCube[Car[1].i][Car[1].j][Car[1].k],c33 = this.rubiksCube[Car[2].i][Car[2].j][Car[2].k];
		console.log("input is:"+c11+" , "+c22+" , "+c33);
		let c1,c2,c3,t,C;	// colors
		for(let i=0;i<4;i++)
		{ 
			c1 = this.rubiksCube[Car[0].i][1][1], c2 = this.rubiksCube[Car[1].i][1][1], c3 = this.rubiksCube[Car[2].i][1][1];
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
		let i  , ed , other_face , face1 , face2, nt_face,nt_edge;
		for(i=0;i<4;i++)
        {
			// find white edge
            ed = this.search_edge_color('W');
            console.log("ed="+ed.i+","+ed.j+","+ed.k);
            // find both faces of it
            other_face = this.other_edge_face(ed.i,ed.j,ed.k);
            face1 = ed.i;   face2 = other_face.i;
			//if any face is down do nothing
            if(face1 == this.down || face2 == this.down)
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
            let front_color = this.rubiksCube[nt_face][1][1];
            console.log("front color="+front_color);
            
            this.rotate_and_match(front_color);
            this.parse("2F");
            console.log("2F to bring it up");
            if(this.rubiksCube[this.front][0][1] == 'W')
                this.parse("F' U L' U' L D' L'") , console.log("F' U L' U' L D' L' done to reorient edge");
            this.look(this.right);
        }
	//	this.moves.push("white cross done");
		console.log("------------------------------------------------------------");
	}
	
	white_corners()
	{	
		let i;
		for(i=0;i<4;i++)
		{
			let Car = this.search_corner_color('W');
			console.log("corner: "+Car[0].i+","+Car[0].j+","+Car[0].k+" & "+Car[1].i+","+Car[1].j+","+Car[1].k+" & "+Car[2].i+","+Car[2].j+","+Car[2].k);
			
			if( this.is_center_match(Car[0]) && this.is_center_match(Car[1]) && this.is_center_match(Car[2]) ) {
				console.log("already this corner is in place!");
				this.record_move("This corner is already in place, as its colors match with that of the face center.");
				continue;
			}
			
			let s_face = this.get_side_face(Car);
			console.log("side face= "+s_face.i);
			if(s_face.k == 2)
				this.look(s_face.i);
			else
				this.look(s_face.i) , this.look(this.left);

			
			this.record_move(`looking at that face: where cube @ right: ${s_face.i}.`);
			console.log(`looking at that face: where cube @ right: ${s_face.i}`);
			if(s_face.j == 0) // corner at the top row
			{
				console.log("@ top");
				this.record_move("this corner is at the top row, bring it down right by doing R' D' R D.");
				this.final_step();	console.log("R' D' R D done");	// bring it to down right
			}
			else{ // corner at the bottom row 
				console.log("@ bottom");
				this.record_move("this corner is at the bottom row.");
			}
				
			console.log("cube at bottom right");
			this.record_move("found a cube at bottom right.");
			
			let f = [{i:this.front,j:2,k:2}] , other = this.other_corner_faces(f[0].i,f[0].j,f[0].k); 
			f.push(other[0]); f.push(other[1]);
			f = this.sort_colors(f);
			this.position_down_right_appropriately(f);
			
			if(this.rubiksCube[f[2].i][f[2].j][f[2].k] != 'W')
				console.log("error! the 3rd face of corner piece isn't white da!");
			
			if(f[2].i == this.down) {	
				console.log("W @ down => do R' D' R D, 3 times"); 
				this.record_move("White face at the bottom, so do R' D' R D, 3 times.");
				this.final_step(); this.final_step(); this.final_step();
			} else if(f[2].i == this.right) {	
				console.log("W @ right => do R' D' R D once");
				this.record_move("White face is at right side, so do R' D' R D, 1 time.");
				this.record_move("found a cube at bottom right.");
				this.final_step();
			} else { 	// front
				console.log("W @ front => do D' R' D R");
				this.record_move("White face at front, so do D' R' D R.");
				this.parse("D' R' D R");
			}
			console.log("corner placed successfully");
			this.record_move("We have placed this corner successfully.")
		}
	}
	
	layer1()
    {
		this.reset_saved_pieces();
		console.log("Layer1:");
		console.log("------------------------------------------------------------");
		this.record_move("To solve the first layer (the yellow top), we need to first create a yellow cross at the top, for which, we will bring the white (opposite color of yellow) layer center at top by doing the following moves:");
        
		this.white_to_top('W');
        console.log("brought white center at top");
		this.record_move("Now that we brought the white face to the top, lets create the white cross first, then rotate each points of the cross to the opposite face (yellow) to create yellow cross.");
		
		if(this.check_l1_cross()) {
			console.log("white cross already done!");
			this.record_move("The white cross is already done.");
		}
        else {
			this.white_cross(this.top);
			this.record_move("The white cross is now done, let's check if the white corner pieces are in their place.");
		}
        if(this.check_corners(this.top)) {
			console.log("white corners already done!");
			this.record_move("The white corner pieces are already in their place.");
		}
        else {
			this.record_move("Now, lets bring the white corner pieces into their place.");
			this.white_corners();
		}
		console.log("---------------------------LAYER 1 OVER------------------------------");
	}
	
	count_middle_matching_edges()
	{
		let e,o,x=0;
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
		let e,o;
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
        console.log("turn white face down => 2r 2L'");
		this.record_move("Let's bring the solved layer to the bottom.");
        this.parse("2r 2L'");
		
		let solvedEdges = this.count_middle_matching_edges();
		let topFaceColorEdges,top_color,oppa_top_color;
		console.log(`There are ${solvedEdges} matching edges already.`);
		this.record_move(`There are ${solvedEdges} edges already in place in the middle layer.`);
		
		this.record_move("Let's search for the unsolved edges at the top layer. The candidates are those edges that are of a color other than the top layer. Once we find such a candidate edge we rotate to align its front face color with the face's center.");

		const bringNonYellowEdgeFromMiddleLayerToTop = "L' U' L U F U F'";
		
		for(;solvedEdges<4;)
		{
			console.log("search top");
			this.record_move("Searching for non-yellow edges at the top layer.");
			topFaceColorEdges = this.search_top_non_yellow_edges();
			if(!topFaceColorEdges)
			{
				console.log("No non-yellow edges @ top so do:");
				this.record_move("There aren't any non-yellow edges at the top face, so we bring an unsolved edge from the middle layer to the top layer, and then place it in its correct position in the middle layer.");
				
				for(let j=0;j<4;j++) {
					if(this.is_center_match({i:this.front,j:1,k:0}) && this.is_center_match({i:this.left,j:1,k:2}))
						this.look(this.right);
					else
						break;
				}
				
				console.log(bringNonYellowEdgeFromMiddleLayerToTop);
				this.record_move(`Found an unsolved edge in the middle layer, let's bring it to the top layer by doing: ${bringNonYellowEdgeFromMiddleLayerToTop}`);
				this.parse(bringNonYellowEdgeFromMiddleLayerToTop);
				continue;	// 'solvedEdges' isn't incremented here, as we haven't placed that edge in correct position in middle layer yet.
			}
			
			console.log("found a non-yellow edge: "+topFaceColorEdges.i+","+topFaceColorEdges.j+","+topFaceColorEdges.k);
			this.record_move("We found a non-yellow edge, Let's get it to align with its face.");
			this.look(topFaceColorEdges.i);
			for(let j=0;j<4;j++) {
				if(this.is_center_match({i:this.front,j:0,k:1}))
					break;
				else {
					console.log("d");
					this.parse("d");
				}
			}
			console.log("matched with center");
			
			top_color = this.rubiksCube[this.top][2][1];
			oppa_top_color = this.opp_color(top_color);
			let bringEdgeToPositionMove = ""
			if(this.rubiksCube[this.right][1][1] === oppa_top_color) {
				bringEdgeToPositionMove = "U' L' U L U F U' F'";	
			}
			else {
				bringEdgeToPositionMove = "U R U' R' U' F' U F";
			}
			console.log(bringEdgeToPositionMove);
			this.record_move(`Now that we have aligned the top edge with its corresponding face, let's place this edge piece from the top layer to the middle layer by doing: ${bringEdgeToPositionMove}`);
			this.parse(bringEdgeToPositionMove);
			
			solvedEdges++;
		
		}
		console.log("---------------------------LAYER 2 OVER------------------------------");
	}
	
	search_top_yellow_edges()
	{
		let A = [ {i:this.top,j:0,k:1} , {i:this.top,j:1,k:0} , {i:this.top,j:1,k:2} , {i:this.top,j:2,k:1} ];
		if(this.is_equal_color(A[0],'Y') && this.is_equal_color(A[1],'Y') && this.is_equal_color(A[2],'Y') && this.is_equal_color(A[3],'Y'))
		{console.log("all 4 are yellow @ top"); return 4;}
		if( !this.is_equal_color(A[0],'Y') && !this.is_equal_color(A[1],'Y') && !this.is_equal_color(A[2],'Y') && !this.is_equal_color(A[3],'Y'))
		{console.log("none are yellow @ top"); return 0;}
		for(let i=0;i<4;i++)
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
		let f,c1,c2,c3,C,ret=[],other;
		for(let fac = this.left;fac<=this.back; fac++)
		{
			f = [{i:fac,j:0,k:0}] , other = this.other_corner_faces(f[0].i,f[0].j,f[0].k); 
			f.push(other[0]); f.push(other[1]);
			f = this.sort_colors(f);
			c1 = this.rubiksCube[f[0].i][1][1], c2 = this.rubiksCube[f[1].i][1][1], c3 = this.rubiksCube[f[2].i][1][1];
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
		return (this.rubiksCube[this.top][0][1] == 'Y'&&this.rubiksCube[this.top][1][0] == 'Y'&&this.rubiksCube[this.top][1][2] == 'Y'&&this.rubiksCube[this.top][2][1] == 'Y');
	}
	
	layer3()
	{
		this.reset_saved_pieces();
		
		console.log("Layer3:");
		console.log("------------------------------------------------------------");
		this.record_move("To solve the final layer (top layer), we first create a cross, where in each top layer edge aligns with its face.")
		
        if(this.rubiksCube[this.down][1][1]!='W') {
			this.record_move("We are bringing the white face to the top.");
			this.white_to_top('Y');
		}
		
		this.record_move("We first count the number of top layer edges that are the same color as the top layer (yellow). They need not be in their proper place yet.")
		let topYellowEdges = this.search_top_yellow_edges() , i , k;

		let movesToCreateCross = "";
		if(topYellowEdges == 0) {	// dot
			movesToCreateCross = "F R U R' U' F' f R U R' U' f'";
			this.record_move(`There are no edges that are properly aligned with their faces, let's form the cross by doing: ${movesToCreateCross}`)
			console.log(movesToCreateCross);
			this.parse(movesToCreateCross);
		} else if(topYellowEdges == 2) {// inverted L
			movesToCreateCross = "F U R U' R' F'";
			this.record_move(`The two edges that align with their faces form a mirrored "L" shape. let's form the cross by doing: ${movesToCreateCross}`)
			console.log(movesToCreateCross);
			this.parse(movesToCreateCross);
		} else if(topYellowEdges == 3) {// horizontal Y
			movesToCreateCross = "F R U R' U' F'";
			this.record_move(`The three edges that align with their faces form a horizontal "T" shape. let's form the cross by doing: ${movesToCreateCross}`)
			console.log(movesToCreateCross);
			this.parse(movesToCreateCross);
		}
		else { // if topYellowEdges == 4 no need to do above step
			this.record_move(`The cross is already present with all 4 edges having yellow top color.`);
		}
		this.record_move("The yellow cross now has some edges that align with their face while others don't. Let's align the edges properly with their faces. To do so, lets first count how many edges are already aligning by rotating the top.");
		
		k=0;
		let alignedEdges=0;

		for(;k<4;k++)
		{
			alignedEdges=0;
			for(let i=this.left;i<=this.back;i++)
				if(this.rubiksCube[i][0][1] == this.rubiksCube[i][1][1])
					alignedEdges++;
			if(alignedEdges>=2)
				break;
		
			console.log("U");
			this.parse("U");
		}
		if(k==4)
		{
			console.log("alignedEdges<2 error");
		}
		console.log("there are now >= 2 matching edges @ top");
		this.record_move("There are more than 2 edges aligned properly.");
		console.log("alignedEdges=",alignedEdges);

		let movesToAlignEdges = "";

		if(alignedEdges<4)
			for(i=0;i<4;i++)
			{
				if( this.is_center_match({i:this.left,j:0,k:1}) && this.is_center_match({i:this.right,j:0,k:1}) )	// horizontal
				{
					movesToAlignEdges = "R U R' U R 2U R' 2U u D' R U R' U R 2U R' U";
					console.log("horizontal match, do ",movesToAlignEdges);
					this.record_move(`The edges align horizontally. let's align the remaining edges by doing: ${movesToAlignEdges}`)
					this.parse(movesToAlignEdges);
					break;
				}
				
				if( this.is_center_match({i:this.back,j:0,k:1}) && this.is_center_match({i:this.right,j:0,k:1}) )	// right and back	
				{
					movesToAlignEdges = "R U R' U R 2U R' U";
					console.log("back and right match, do",movesToAlignEdges);
					this.record_move(`The back and right edges align properly. let's align the remaining edges by doing: ${movesToAlignEdges}`)
					this.parse(movesToAlignEdges);
					break;
				}
				
				this.look(this.right); //  no shape found => look right
				console.log("no matching shape found, looking right");
				
			}
		// if alignedEdges == 4 => no need of above steps		
		console.log("edges matching now");
		this.record_move("The yellow cross is now formed. Now, let's bring the corners into their correct position (they need not align their colors with their faces yet). First, let's find the corners that are already in their correct position.");
		
		k=0;
		let properCornersArr,fac,o;
		let num=0;
		const ProperCornerSearchRetryMove = "U R U' L' U R' U' L";
		while(true)
		{
			properCornersArr = this.search_corner_proper_place();
			if(properCornersArr.length == 0)
			{
				console.log(`no proper corner found so do ${ProperCornerSearchRetryMove} and try again`);
				this.record_move(`No proper corner found so do ${ProperCornerSearchRetryMove} and try again.`);
				this.parse(ProperCornerSearchRetryMove);
				continue;
			}
			
			console.log("corner found");
			this.record_move(`Found a proper corner.`);
			console.log("corner1= "+properCornersArr[0][0].i+" , "+properCornersArr[0][0].j+" , "+properCornersArr[0][0].k);
			
			if(properCornersArr.length == 4)
			{
				console.log("all corner in proper position");
				break;
			}
			
			else if(properCornersArr.length == 1 || (properCornersArr.length == 2 ))
			{
				this.record_move(`There are 2 proper corners. Now let's place the other corners in the correct position by bringing them to the top right corner of the front face.`);
				o = this.other_corner_faces(properCornersArr[0][0].i,properCornersArr[0][0].j,properCornersArr[0][0].k);
					
				if(properCornersArr[0][0].i == this.top)
				{
					(o[0].k == 0) ? this.look(o[1].i) :  this.look(o[0].i);
				}
				else
				{
					if(properCornersArr[0][0].k == 2)
						this.look(properCornersArr[0][0].i);
					else if(o[0].i != this.top && o[0].k == 2)
						this.look(o[0].i);
					else
						this.look(o[1].i);
					//(properCornersArr[0][0].k == 2) ? this.look(o[1].i) :  this.look(o[0].i);
				}
				console.log(`corner at top right now => do ${ProperCornerSearchRetryMove}`);
				this.record_move(`The corner at top right now, so do ${ProperCornerSearchRetryMove}`);
				this.parse(ProperCornerSearchRetryMove);
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
		this.record_move("The corners in are position now. For the final step, let's align them properly with their faces.")
		
		if(this.check_corners(this.top)) {
			console.log("corners already done!");
			this.record_move("The corners are already aligned. So there is nothing to be done.")
		}
        else
		{		
			const FinalStepMove = "R' D' R D";
			num=0;
			for(let i=0;i<4;i++)
			{	
				num=0;
				this.record_move(`Fix this top-right corner by doing ${FinalStepMove} repeatedly until the corner aligns with its faces.`);
				
				while(this.rubiksCube[this.top][2][2] != 'Y' && num++ <6) {
					console.log(FinalStepMove);
					this.parse(FinalStepMove);
				}
				console.log("U");
				this.record_move("This corner is fixed, rotate the top and fix the top-right corner if not aligned.");
				this.parse("U");
			}
		}
		console.log("---------------------------LAYER 3 OVER------------------------------");	
	}
	
	extractMoveInfo(str) {
		// Extract number of moves (default to 1 if not present)
		const numPrefix = str.match(/^\d+/);
		const numMoves = parseInt(numPrefix, 10) || 1;
		// Extract move direction
		const isAnticlockwise = str.endsWith("'");
		// Extract move type (middle part of the string)
		const limitStart = numPrefix ? numPrefix.toString().length : 0;
		const limitEnd = isAnticlockwise ? -1 : str.length+1;
		const moveType = str.slice(limitStart, limitEnd);
		
		const direction = isAnticlockwise ? "anticlockwise" : "clockwise";
	
		return [numMoves, moveType, direction];
	}

	record_move(str="") {
		const ind = Math.max(this.solution_moves_list[this.solution_layer]?.length,0);
		const log = {index: ind,str:str};
		this.move_descriptions[this.solution_layer].push(log);
	}

	solve3x3()
	{
        this.moves = [];	// empty moves array before solving
        this.moves.push("initial");
        this.states = [];
        
        this.states.push(this.saveCubeStateToString());   // push initial state
		
		this.solution_moves_list = new Array(3);
		this.move_descriptions = new Array(3);
        for(let i=0;i<3;i++) {
			this.solution_moves_list[i] = new Array();
            this.move_descriptions[i] = new Array();
		}
		this.record_move("This solution solves the Rubik's 3x3 cube layer by layer. We will begin by solving the top layer first. Let's solve the white face layer first, then the middle layer, and finally the Yellow layer at last.");
		
        this.store = 1;
        this.solution_layer = 0;   // store all moves of 1st layer in index 0;
        this.layer1();
		this.record_move("Now we have solved the first layer.");
        this.solution_layer = 1;   // store all moves of 2nd layer in index 1;
		this.layer2();
		this.record_move("Now we have solved the second layer.");
        this.solution_layer = 2;   // store all moves of 3rd layer in index 2;
		this.layer3();
		this.record_move("Hurray! we solved the Rubik's 3x3 cube!");
		
        console.log(this.solution_moves_list[0].toString());
        console.log(this.solution_moves_list[1].toString());
        console.log(this.solution_moves_list[2].toString());
        console.log("optimising...");
		this.moves2 = this.optimise(this.moves);
		
        this.solution_moves_list[0] = this.optimise(this.solution_moves_list[0]);
		this.solution_moves_list[1] = this.optimise(this.solution_moves_list[1]);
		this.solution_moves_list[2] = this.optimise(this.solution_moves_list[2]);
		
		console.log("moves length="+this.moves.length+" moves2 length="+this.moves2.length);
        console.log("solved!");
        console.log(this.solution_moves_list[0].toString());
        console.log(this.solution_moves_list[1].toString());
        console.log(this.solution_moves_list[2].toString());
        this.store = 0;
	}
	getnum(sym)
	{

		if(!isNaN(sym[0]))	// assumption : only 1 digit number at maximum
			return { n : sym[0]-'0', s : sym.substring(1,sym.length) };
		return { n : 1, s : sym };
	}

	saveEquivalentMove(sym,num,moves2)
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
		let moves2 = ['initial'];
		let i,j,k,num,sym,mv1,mv2;
		let obj,f=0;
		for( i=0;i<moves.length;i++)
		{
			mv1 = this.getnum(moves[i]); num = mv1.n;	sym = mv1.s;
			//console.log("num="+num+" sym="+sym+" i="+i);
			// for(j=i+1,k=0;j < moves.length;j++,k++)
			// {
			// 	mv2 = this.getnum(moves[j]);
			// 	//console.log("mv2.n="+mv2.n+" mv2.s="+mv2.s+" j="+j);
			// 	if(mv2.s == sym )
			// 		num += mv2.n;	
			// 	else if(mv2.s == this.InvMove[this.InvMoveMap[sym]])
			// 		num -= mv2.n;
			// 	else
			// 		break;
			// }
			this.saveEquivalentMove(sym,num,moves2);
			// i += k;
		}
        return moves2;
	}


	disp()
	{
		
	}

	go_to_move_in_solution(old_k, old_ind, new_k, new_ind){
		// assume the cube is solved
		let oldIndex= 0;
		for(let i=0;i<old_k;i++)  {
			oldIndex += this.solution_moves_list[i].length;
		}
		oldIndex += old_ind;
		let newIndex= 0;
		for(let i=0;i<new_k;i++)  {
			newIndex += this.solution_moves_list[i].length;
		}
		newIndex += new_ind;
		console.log("go_to_move_in_solution(): oldIndex=",oldIndex,",newIndex=",newIndex);


		let movesToDo = "";
		let _solution_moves_list = this.solution_moves_list.flat();
		if(newIndex > oldIndex){
			for(let i = oldIndex+1; i<=newIndex; i++) {
				console.log("doing:",_solution_moves_list[i]);
				this.parse(_solution_moves_list[i]);
			}
		}
		else {
			for(let i = oldIndex; i>newIndex; i--) {
				console.log("doing reverse of:",_solution_moves_list[i]);
				this.parse(_solution_moves_list[i],true);
			}
		}
	}

	show_previous_move_in_solution() {
		// assume the cube is solved
		console.log("show_previous_move_in_solution()");

	}

	show_next_move_in_solution() {
		// assume the cube is solved
		console.log("show_next_move_in_solution()");

	}

}
//-------------------------------------END OF CLASS CUBE----------------------------------------//