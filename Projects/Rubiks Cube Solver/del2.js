
const arr = [
    [
        {index:0,str:"a"},
        {index:0,str:"b"},
        {index:6,str:"c"},
        {index:8,str:"d"},
        {index:10,str:"e"},
    ], 
];

for(let i=0;i<15;i++) {
    let j = arr[0].findIndex((element) => element.index >= i);
    const jind = arr[0][j]?.index;
    console.log("i=",i,",j=",j);
    let movMsg = "";
    if(!jind)
        console.log(movMsg);    
    
    else {    
        for(;j<arr[0].length && arr[0][j]?.index === jind;j++){
        movMsg += arr[0][j]?.str + " " ?? "";
        }
        console.log(movMsg);
    }
    
}



