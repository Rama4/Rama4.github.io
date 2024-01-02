const extractMoveInfo = (str) =>  {
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


const str1 = "2f'";
const str2 = "2343f";
const str3 = "f";
const str4 = "f'";
console.log(extractMoveInfo(str1));
console.log(extractMoveInfo(str2));
console.log(extractMoveInfo(str3));
console.log(extractMoveInfo(str4));


for(let layer=0;layer <  this.defaultDimension; layer++) {
    for(let move of this.solution_moves_list[layer]) {
        const [moveNum, moveType, moveDirection] = this.extractMoveInfo(move);
        console.log("moveNum=",moveNum, ",moveType=",moveType,",moveDirection=",moveDirection);				
    }
}