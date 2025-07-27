var maingridcontainer = document.getElementById("maingridcontainer");
var startbutton = document.getElementById("startbutton");
var statusheading = document.getElementById("statusheading");
var scorebar = document.getElementById("scorebar");
var scorevalue = document.getElementById("scorevalue");
var gameover=true;
var noofcols = 12;
var noofrows = 20;
var boardsize = noofrows * noofcols;
var gamespeed = 500;
var currentlyselectedpiece;
var currentlyselectedpiecematrix = [];
var piecedowninterval;
var currentuserrefcellindex;
var score = 0;


var currentuserarray = [];
var cellsarr = [];
var pieces = ["O", "I", "J", "L", "S", "Z", "T"];
var blockedpieces = [];

let testmatrix = [
    [true, true, true],
    [true, true, false],
    [true, true, false],
    [false, true, false],
    [false, false, false],
    [false, false, false],
];

let Opiecematrix = [
        [true, true],
        [true, true]    
    ];

let Ipiecematrix = [
        [true],
        [true],
        [true],
        [true]       
    ];

let Jpiecematrix = [
        [false, true],
        [false, true],
        [true, true]       
    ];

let Lpiecematrix = [
        [true, false],
        [true, false],
        [true, true]       
    ];

let Spiecematrix = [
        [false, true, true],
        [true, true, false]     
    ];

let Zpiecematrix = [
        [true, true, false],
        [false, true, true]     
    ];

 let Tpiecematrix = [
        [true, true, true],
        [false, true, false]  
    ];


function rotatematrixclockwise(mat){
    let tempmatrix = [];
    for (let i=0; i<mat[0].length; i++){
    
        let temparr = [];
       
        for (let j=(mat.length-1); j>=0; j--){
            
                temparr.push(mat[j][i])
           
        }
        tempmatrix.push(temparr);
    };
    return tempmatrix;
};

function rotatematrixanticlockwise(mat){
    let tempmatrix = [];
    
    for (let i=(mat[0].length - 1); i>=0; i--){
        let temparr = [];
        for (let j=0; j<mat.length; j++){
        
                temparr.push(mat[j][i])
           
        }
        tempmatrix.push(temparr);
    };
    return tempmatrix;
};

startbutton.addEventListener("click", ()=>{
    startgame();
});

function startgame() {
    // if((gameover)){
        gameover = false;
        maingridcontainer.innerHTML = "";
        statusheading.innerHTML = "Use the arrow keys, Shift and Space to play";
        generategridcells();
        resetcurrentarrays();
        blockedpieces = [];
        score = 0;
        scorevalue.innerHTML = score;
        generaterandompiece();
        clearInterval(piecedowninterval);
        piecedowninterval = setInterval(movepiecedown, gamespeed);
        
    // }
};

function resetcurrentarrays(){
    // Opiece = [];
    // currentuserrefrow = 0;
    currentuserrefcellindex = 0;
    clearfloatingbricks();
    currentuserarray = [];
    currentlyselectedpiecematrix = [];
    
    
};

function generategridcells(){

    for (let i=0; i<boardsize; i++){
        let newgridelement = document.createElement("div");
        newgridelement.classList.add("griditem");
        newgridelement.id = i;
        maingridcontainer.appendChild(newgridelement);
    };

    maingridcontainer.style.gridTemplateColumns = `repeat(${noofcols}, ${500/noofcols}px)`;
    maingridcontainer.style.gridTemplateRows = `repeat(${noofrows}, ${500/noofrows}px)`;

 
    cellsarr = [...document.getElementsByClassName("griditem")];
};



function clearfloatingbricks(){
    cellsarr.forEach(cell =>{
        cell.classList.remove("floatingbrick");
    })
};

function addfloatingbricks(indexno) {
    cellsarr[indexno].classList.add("floatingbrick");
};

function addflooredbricks(indexno) {
    cellsarr[indexno].classList.add("flooredbrick");
};

// #region piece generation logic

function generateunblockedpiece(){

   console.log("The blocked pieces are: ", blockedpieces);

    if(blockedpieces.length == pieces.length){
        console.log("Game Over! None of the pieces can be generated in the grid space.");
        gameover = true;
        statusheading.innerHTML = "Game Over! Press start to play again";
        clearInterval(piecedowninterval);
    } else {
        for (piece of pieces){
            if (!blockedpieces.includes(piece)){
                switch(piece){
                    case "O":
                        generateOpiece();
                        break;
                    case "I":
                        generateIpiece();
                        break;
                    case "J":
                        generateJpiece();
                        break;
                    case "L":
                        generateLpiece();
                        break;
                    case "S":
                        generateSpiece();
                        break;
                    case "Z":
                        generateZpiece();
                        break;
                    case "T":
                        generateTpiece();
                        break;
                        
                }
                break;
            }
        }
    }

    
};

function checkbricksincolfordepth(colno,depth){
    let bricksincol = cellsarr.filter(cell=>{
        return (parseInt(cell.id) < (noofcols * depth)) && (cell.classList.contains("flooredbrick"))
        && (parseInt(cell.id)%noofcols == colno)
    })
    // console.log("bricksincol is: ", bricksincol);
    return bricksincol.length>0 ? true:false;
};

function getavailablecolumns(piecematrix){

    let piecewidth = piecematrix[0].length;
    let lastrow = piecematrix.length - 1;
    let lastrowitems = piecematrix[lastrow];

    
    let lastrowmap = lastrowitems.map(cell => cell ? 1 : 0);

    // For potential future features where a piece matrix could have multiple empty rows at the bottom
    while (!lastrowmap.includes(1) && lastrow >=0){
        lastrow--;
        lastrowitems = piecematrix[lastrow];
        lastrowmap = lastrowitems.map(cell => cell ? 1 : 0);
    }

    let relativerowheightmap = lastrowmap.map((lastrowitem, itemindex) =>{
        if (!lastrowitem) {
            
            for (let i=(lastrow -1); i>=0; i--){
                if (!piecematrix[i][itemindex]){
                    lastrowitem--;
                } else {break;}
            }
        }
        return lastrowitem-1;
    });

    // The height of the empty rows are trimmed out from the piecematrix
    let pieceheight1 = lastrow +1;

    let depthmap = relativerowheightmap.map(col =>{
        return col + pieceheight1;
    });

    let availablecols = [];

    for (let i=0; i<(noofcols-piecewidth+1);i++){
        let piecefitcheck = depthmap.map((piececoldepth, piececolindex)=>{
            return checkbricksincolfordepth((i+piececolindex), piececoldepth);
        });
        if(!piecefitcheck.includes(true)){
            availablecols.push(i)
        }
    };

    // console.log("pieceheight1 is: ", pieceheight1);

    // console.log("lastrowmap is: ", lastrowmap);

    // console.log("depthmap is: ", depthmap);

    // #region legacy code

    // let pieceheight2;
    // lastrowmap.includes(0) ? pieceheight2 = (pieceheight1 -1) : pieceheight2 = pieceheight1;

// check for any obstructions from floored bricks that would coincide with the location of the cells in the piece
    // let bricksinthewayheight1 = cellsarr.filter(cell =>{
    //     return ((parseInt(cell.id) < (noofcols * pieceheight1)) && (cell.classList.contains("flooredbrick")));
    // });

    

    // let colbricksinwayheight1 = bricksinthewayheight1.map(brickcell => parseInt(brickcell.id)%noofcols);

    // let pieceheight1emptycols = [];
    // let pieceheight2emptycols = [];

    // To check all the available columns for height1 here
    // for (let i=0; i<(noofcols); i++){
    //     if(!colbricksinwayheight1.includes(i)){
    //         pieceheight1emptycols.push(i);
    //     }
    // };

    // if(pieceheight1 !== pieceheight2){
    //     let bricksinthewayheight2 = cellsarr.filter(cell =>{
    //     return ((parseInt(cell.id) < (noofcols * pieceheight2)) && (cell.classList.contains("flooredbrick")));
    //     });

    //     let colbricksinwayheight2 = bricksinthewayheight2.map(brickcell => parseInt(brickcell.id)%noofcols);

        

    //     // To check all the available columns for height2 here
    //     for (let i=0; i<(noofcols); i++){
    //         if(!colbricksinwayheight2.includes(i)){
    //             pieceheight2emptycols.push(i);
    //         }
    //     };

    // } else {
    //     // bricksinthewayheight2 = bricksinthewayheight1;
    //     // colbricksinwayheight2 = colbricksinwayheight1;
    //     pieceheight2emptycols = pieceheight1emptycols;

    // }

    //  console.log("pieceheight1emptycols is: ", pieceheight1emptycols, "pieceheight2emptycols is: ", pieceheight2emptycols);

    // This is the final available columns list for the selected piece type
    


   
    // if (piece == "O" || piece == "I" || piece == "J" || piece == "L") {
    //     for (let i=0; i<pieceheight1emptycols.length; i++){
            
    //             if(piecewidth == 1){
    //                 availablecols.push(pieceheight1emptycols[i])
    //             }
    //             if(piecewidth == 2){
    //                 if((pieceheight1emptycols[i+1])){
    //                     if((parseInt(pieceheight1emptycols[i]) + 1) == parseInt(pieceheight1emptycols[i+1])){
    //                         availablecols.push(pieceheight1emptycols[i])
    //                     }
    //                 }
    //             }
    //             if(piecewidth == 3){

    //                 if((pieceheight1emptycols[i+1]) && (pieceheight1emptycols[i+2])){
    //                     if((parseInt(pieceheight1emptycols[i]) + 1) == parseInt(pieceheight1emptycols[i+1])
    //                         && (parseInt(pieceheight1emptycols[i]) + 2) == parseInt(pieceheight1emptycols[i+2])){
    //                         availablecols.push(pieceheight1emptycols[i])
    //                     }
    //                 }

    //             }
            
    //     };
    // } else if (piece == "S" || piece == "Z" || piece == "T"){

    //     for (let i=0; i<pieceheight1emptycols.length; i++){
    //         let height1colnum = parseInt(pieceheight1emptycols[i]);

    //         if(piece == "S"){
    //             if (pieceheight1emptycols.includes(height1colnum+1) && pieceheight2emptycols.includes(height1colnum+2)){
    //                 availablecols.push(pieceheight1emptycols[i])
    //             }
    //         }

    //         if(piece == "Z"){
    //             if (pieceheight1emptycols.includes(height1colnum+1) && pieceheight2emptycols.includes(height1colnum-1)){
    //                 // have to subtract 1 to reflect the top left cell used in other parts of the logic
    //                 availablecols.push(pieceheight1emptycols[i]-1)
    //             }
    //         }

    //         if(piece == "T"){
    //             if (pieceheight2emptycols.includes(height1colnum+1) && pieceheight2emptycols.includes(height1colnum-1)){
    //                 availablecols.push(pieceheight1emptycols[i]-1)
    //             }
    //         }

    //     }
    // }

    // #endregion legacy code

    // console.log("availablecols is: ", availablecols);
    return availablecols;
    
};

function generateOpiece(){
    // currentlyselectedpiece = "O";
    resetcurrentarrays();
    
    

    // always generate the item from the top-left corner of the grid

    

    
    // let availablecols = getavailablecolumns("O");
    let availablecols = getavailablecolumns(Opiecematrix);

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Opiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        // console.log("There is no space to generate new O piece. availablecols is: ", availablecols);
        blockedpieces.push("O");
        generateunblockedpiece();
    }
    
}


function generateIpiece(){

    // currentlyselectedpiece = "I";
    resetcurrentarrays();
    // The top left most cell of an I piece can be generatated in any column in the top most row 
    currentuserrefcellindex = Math.floor(Math.random()*(noofcols));

    // let Ipiece = [];
    // Ipiece.push(currentuserrefcellindex, (currentuserrefcellindex+(noofcols*1)), (currentuserrefcellindex+(noofcols*2)), (currentuserrefcellindex+(noofcols*3)));

    


    // let availablecols = getavailablecolumns("I");
    let availablecols = getavailablecolumns(Ipiecematrix);

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Ipiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        // console.log("There is no space to generate new I piece. availablecols is: ", availablecols);
        blockedpieces.push("I");
        generateunblockedpiece();
    }


};

function generateJpiece(){

    resetcurrentarrays();

    // The top left most cell of an J piece matrix can be generatated in any column from 0 to (no of cols - 2) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-1)));

    

    

    // let availablecols = getavailablecolumns("J");
    let availablecols = getavailablecolumns(Jpiecematrix);

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Jpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        // console.log("There is no space to generate new J piece. availablecols is: ", availablecols);
        blockedpieces.push("J");
        generateunblockedpiece();
    }
}

function generateLpiece(){

    resetcurrentarrays();
    // The top left most cell of an L piece can be generatated in any column from 0 to (no of cols - 2) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-1)));



    

    // let availablecols = getavailablecolumns("L");
    let availablecols = getavailablecolumns(Lpiecematrix);

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Lpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        // console.log("There is no space to generate new L piece. availablecols is: ", availablecols);
        blockedpieces.push("L");
        generateunblockedpiece();
    }
}

function generateSpiece(){

    resetcurrentarrays();

    // The top left most cell of an S piece matrix can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-2)));

    

    

    // let availablecols = getavailablecolumns("S");
    let availablecols = getavailablecolumns(Spiecematrix);

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Spiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        // console.log("There is no space to generate new S piece. availablecols is: ", availablecols);
        blockedpieces.push("S");
        generateunblockedpiece();
    }

}

function generateZpiece() {

    resetcurrentarrays();
    // The top left most cell of an Z piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-2)));

    

    // let availablecols = getavailablecolumns("Z");
    let availablecols = getavailablecolumns(Zpiecematrix);

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Zpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        // console.log("There is no space to generate new Z piece. availablecols is: ", availablecols);
        blockedpieces.push("Z");
        generateunblockedpiece();
    }
}

function generateTpiece() {

    resetcurrentarrays();
    // The top left most cell of an T piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-2)));

   

    // let availablecols = getavailablecolumns("T");
    let availablecols = getavailablecolumns(Tpiecematrix);

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Tpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        // console.log("There is no space to generate new T piece. availablecols is: ", availablecols);
        blockedpieces.push("T");
        generateunblockedpiece();
    }
}

function getcurrentuserarray(){
     currentuserarray = [];
     console.log("currentuserrefcellindex value received inside getcurrentuserarray() is: ", currentuserrefcellindex);
    //  The currentuserrefcellindex is the starting index of the topmost cell in the matrix
    currentlyselectedpiecematrix.forEach((row, rowadd)=>{
        // For toprow, we need to add +1 for each subsequent item from the currentuserrefcellindex
        row.forEach((cell,colindex)=>{
            console.log("In currentarraygen loop, rowindex is noW: ", rowadd, " ,column index is now: ", colindex, " and truthy is: ", cell);
            if(cell){
                currentuserarray.push(currentuserrefcellindex + (rowadd*noofcols) + colindex);
            }
        })
    });
    // currentuserarray.forEach(addfloatingbricks);
}


function generaterandompiece(){
    let randomsel = Math.floor(Math.random() * 7);
    // console.log("randomsel number is: ", randomsel);
    
    switch(randomsel){
        case 0:
        generateOpiece();
        break;

        case 1:
        generateIpiece();
        break;

        case 2:
        generateJpiece();
        break;

        case 3:
        generateLpiece();
        break;

        case 4:
        generateSpiece();
        break;

        case 5:
        generateZpiece();
        break;

        case 6:
        generateTpiece();
        break;
    }
}



// #endregion piece generation logic

// #region logic for left and right movement
function movepieceright(){
    getcurrentuserarray();
    // console.log("currentuserarray before movepieceright is: ", currentuserarray);
    // The right most column in all the elements from currentuserarray is used to check for right wall
    let colmap = currentuserarray.map(index =>{
        return (index%noofcols);
    })
    let rightmostcol = Math.max(...colmap);

    let flooredpiecescheck = currentuserarray.filter(index =>{
        if(cellsarr[index+1]){
        return cellsarr[index+1].classList.contains("flooredbrick");
        }
    })
    // if (flooredpiecescheck.length>0){
    // console.log("right flooredpiecescheck is: ", flooredpiecescheck);
    // }
    
    if (!(rightmostcol == (noofcols -1)) && !(flooredpiecescheck.length >0)){
        clearfloatingbricks();
        console.log("currentuserrefcellindex before movepieceright is: ", currentuserrefcellindex);
        currentuserrefcellindex++;
        console.log("currentuserrefcellindex after movepieceright is: ", currentuserrefcellindex);
        getcurrentuserarray();
        // currentuserarray = currentuserarray.map(piececell => piececell +1);
        currentuserarray.forEach(addfloatingbricks);
        console.log("The currentuserarray is: ", currentuserarray);
    } else {
        // console.log("The piece has hit a right wall");
    }
};

function movepieceleft(){
    getcurrentuserarray();
   // The left most column in all the elements from currentuserarray is used to check for left wall
    let colmap = currentuserarray.map(index =>{
        return (index%noofcols);
    })
    let leftmostcol = Math.min(...colmap);

    let flooredpiecescheck = currentuserarray.filter(index =>{
        if(cellsarr[index-1]){
        return cellsarr[index-1].classList.contains("flooredbrick");
        }
    })
    // if (flooredpiecescheck.length>0){
    // console.log("left flooredpiecescheck is: ", flooredpiecescheck);
    // }

    if(!(leftmostcol == 0) && !(flooredpiecescheck.length >0) ){
        clearfloatingbricks();
        console.log("currentuserrefcellindex before movepieceleft is: ", currentuserrefcellindex);
        currentuserrefcellindex--;
        console.log("currentuserrefcellindex after movepieceleft is: ", currentuserrefcellindex);
        getcurrentuserarray();
        // currentuserarray = currentuserarray.map(piececell => piececell -1);
        currentuserarray.forEach(addfloatingbricks);
        console.log("The currentuserarray is: ", currentuserarray);
    } else {
        // console.log("The piece has hit a left wall");
    }
};

function rotatepiececlockwise(){

    getcurrentuserarray();
    let prevuserarr = currentuserarray;

    let currentmatrixlength = currentlyselectedpiecematrix[0].length;
    let currentmatrixheight = currentlyselectedpiecematrix.length;
    let dimensiondifference = Math.abs(currentmatrixlength - currentmatrixheight);

    let colmap = currentuserarray.map(index =>{
        return (index%noofcols);
    });

    let rowmap = currentuserarray.map(index =>{
        return (Math.floor(index/noofcols));
    });

    let rightmostcol = Math.max(...colmap);
    // let leftmostcol = Math.min(...colmap);
    let bottommostrow = Math.max(...rowmap);
    
    let rightoverflowcheck = rightmostcol + dimensiondifference;
    let bottomoverflowcheck = bottommostrow + dimensiondifference;

    // Right walls check

    let leftcascading = false;
    // if((rightmostcol == (noofcols-1)) && (currentmatrixheight > currentmatrixlength)){
    if( (rightoverflowcheck > (noofcols-1)) && (currentmatrixheight > currentmatrixlength)){
        currentuserrefcellindex -= rightoverflowcheck-(noofcols-1);
        leftcascading = true;
    }

    // Bottom walls check
    let uppercascading = false;
    //  if((bottommostrow == (noofrows-1)) && (currentmatrixheight < currentmatrixlength)){
     if((bottomoverflowcheck > (noofrows-1)) && (currentmatrixheight < currentmatrixlength)){
        currentuserrefcellindex -= ((bottomoverflowcheck-(noofrows-1))*noofcols);
        uppercascading = true;
    }

    let checkwallinrotationmat = rotatematrixclockwise(currentlyselectedpiecematrix);
    currentlyselectedpiecematrix = checkwallinrotationmat;

    getcurrentuserarray();
    let bricksintheway = currentuserarray.filter(index =>{
        return cellsarr[index].classList.contains("flooredbrick");
    });

    if (bricksintheway.length > 0){
        // Revert 
        currentuserarray = prevuserarr;
        let checkwallinrotationmat = rotatematrixanticlockwise(currentlyselectedpiecematrix);
        currentlyselectedpiecematrix = checkwallinrotationmat;
        if(leftcascading == true){
            currentuserrefcellindex += rightoverflowcheck-(noofcols-1);
            leftcascading = false;
        }

        if(uppercascading == true){
            currentuserrefcellindex += ((bottomoverflowcheck-(noofrows-1))*noofcols);
            uppercascading = false;
        }

    }

    clearfloatingbricks();
    currentuserarray.forEach(addfloatingbricks);
}

function rotatepieceanticlockwise(){

    getcurrentuserarray();
    let prevuserarr = currentuserarray;

    let currentmatrixlength = currentlyselectedpiecematrix[0].length;
    let currentmatrixheight = currentlyselectedpiecematrix.length;
    let dimensiondifference = Math.abs(currentmatrixlength - currentmatrixheight);

    let colmap = currentuserarray.map(index =>{
        return (index%noofcols);
    });

    let rowmap = currentuserarray.map(index =>{
        return (Math.floor(index/noofcols));
    });

    let rightmostcol = Math.max(...colmap);
    // let leftmostcol = Math.min(...colmap);
    let bottommostrow = Math.max(...rowmap);
    
    let rightoverflowcheck = rightmostcol + dimensiondifference;
    let bottomoverflowcheck = bottommostrow + dimensiondifference;

    // Right walls check

    let leftcascading = false;
    // if((rightmostcol == (noofcols-1)) && (currentmatrixheight > currentmatrixlength)){
    if( (rightoverflowcheck > (noofcols-1)) && (currentmatrixheight > currentmatrixlength)){
        currentuserrefcellindex -= rightoverflowcheck-(noofcols-1);
        leftcascading = true;
    }

    // Bottom walls check
    let uppercascading = false;
    //  if((bottommostrow == (noofrows-1)) && (currentmatrixheight < currentmatrixlength)){
     if((bottomoverflowcheck > (noofrows-1)) && (currentmatrixheight < currentmatrixlength)){
        currentuserrefcellindex -= ((bottomoverflowcheck-(noofrows-1))*noofcols);
        uppercascading = true;
    }

    let checkwallinrotationmat = rotatematrixanticlockwise(currentlyselectedpiecematrix);
    currentlyselectedpiecematrix = checkwallinrotationmat;

    getcurrentuserarray();
    let bricksintheway = currentuserarray.filter(index =>{
        return cellsarr[index].classList.contains("flooredbrick");
    });

    if (bricksintheway.length > 0){
        // Revert 
        currentuserarray = prevuserarr;
        let checkwallinrotationmat = rotatematrixclockwise(currentlyselectedpiecematrix);
        currentlyselectedpiecematrix = checkwallinrotationmat;
        if(leftcascading == true){
            currentuserrefcellindex += rightoverflowcheck-(noofcols-1);
            leftcascading = false;
        }

        if(uppercascading == true){
            currentuserrefcellindex += ((bottomoverflowcheck-(noofrows-1))*noofcols);
            uppercascading = false;
        }

    }

    clearfloatingbricks();
    currentuserarray.forEach(addfloatingbricks);
}

// #endregion logic for left and right movement

function movepiecedown() {
    clearfloatingbricks();
    if(!checkfloor() ){
        
        currentuserrefcellindex += noofcols;
        getcurrentuserarray();
        // currentuserarray = currentuserarray.map(piececell => piececell + noofcols);
      
        // optionally make the object bricked instantly rather than waiting till the next movement
        // if(!checkfloor()){
        currentuserarray.forEach(addfloatingbricks);
        // } else {
        //     currentuserarray.forEach(addflooredbricks);
        //     resetcurrentarrays();
        // }
        // console.log(currentuserarray);
    }else {
        currentuserarray.forEach(addflooredbricks);
        
        checkbrickedrows();
        if (!gameover){
            resetcurrentarrays();
            generaterandompiece();
        };
        // console.log("The piece has hit the bottom wall or a floored brick");
    }
};

function checkfloor(){
    
    getcurrentuserarray();
    let floorhitcells = currentuserarray.filter(cell =>{
       return ((cell + noofcols) >= boardsize) || (cellsarr[cell + noofcols].classList.contains("flooredbrick"))       
    });

    // console.log("floorhit cells returned is: ", floorhitcells);
    return floorhitcells.length >0 ? true : false;
};

document.addEventListener("keydown", (e)=>{
    e.preventDefault();
    if(e.key == "ArrowLeft"){
        movepieceleft();
    }

    if(e.key == "ArrowRight"){
        movepieceright();
    }

    if(e.key == "ArrowDown"){
        movepiecedown();
    }

    if(e.key == " ") {
        
        rotatepiececlockwise();
    }

    if(e.key == "Shift") {
        rotatepieceanticlockwise();
    }
    
});

function checkbrickedrows(){

    let rowsofbricked = [];
    let  brickedcells = [...document.getElementsByClassName("flooredbrick")];
    brickedcells.forEach(cell =>{
        // rowsofbricked collects the row numbers of all the bricked cells
        rowsofbricked.push(Math.floor(parseInt(cell.id)/noofcols));
    });

    if(rowsofbricked.includes(0)){
        console.log("Gameover! The bricks have hit the ceiling!");
        clearInterval(piecedowninterval);
        gameover = true;
        statusheading.innerHTML = "Game Over! Press start to play again";
    };

    if(!gameover){
        // uniquerowsarr stores the unique rows with atleast one bricked cell
        let uniquerowsarr = [...new Set(rowsofbricked)];
        // fullrowsarr stores the unique rows with all cells bricked in it
        let fullrowsarr = [];

        uniquerowsarr.forEach(uniquerownumber =>{
            let localcounter =0;
            for (let i=0; i<rowsofbricked.length; i++){
                if (uniquerownumber == rowsofbricked[i]){
                    localcounter++;
                    // console.log(`local counter for rownumber ${uniquerownumber}, comparing ${rowsofbricked[i]} is ${localcounter}`);
                    if (localcounter >= noofcols){
                        fullrowsarr.push(uniquerownumber);
                        break;
                    }
                }
                
            }
        });

        // console.log("rowsofbricked is: ", rowsofbricked);
        // console.log("uniquerowsarr is: ", uniquerowsarr);
        // console.log("fullrowsarr is: ", fullrowsarr);
        
        // Removing all full rows of bricked cells
        fullrowsarr.forEach(fullrow =>{
            let startingind = parseInt(fullrow) * noofcols;
            let finishingind = startingind + (noofcols-1);

            for (let i=startingind; i <= finishingind; i++){
                cellsarr[i].classList.remove("flooredbrick");
            };
            score++;
            scorevalue.innerHTML = score;
        });

        // The floored bricks would still be floating in place b/w the rows which are just cleared needs to cascade down
        setTimeout(() => {
            
        
            fullrowsarr.sort(function(a,b){return a - b});
            fullrowsarr.forEach(clearedrow =>{
                
                let cascadebrickstill = parseInt(clearedrow) * noofcols;
                let noofrowsremoved = fullrowsarr.length;
                console.log("clearedrow being used is: ", clearedrow ,", cascasdebrickstill is: ", cascadebrickstill, " and nowofrowsremoved is: ", noofrowsremoved);
                brickedcells = [...document.getElementsByClassName("flooredbrick")];
                let newindicestoadd = [];
                brickedcells.forEach(brick =>{
                    let brickind = parseInt(brick.id);
                    if (brickind < cascadebrickstill){
                        console.log("brickind used inside cascade logic is: ", brickind);
                        // remove flooredbrick class on cell and add it to (noofcols*noofrowsremoved) index
                        brick.classList.remove("flooredbrick");
                        let newindex = brickind +(noofcols);
                        newindicestoadd.push(newindex);
                        console.log("cascaded cell referenced is: ", cellsarr[brickind +(noofcols*noofrowsremoved)]);
                        // cellsarr[brickind +(noofcols*noofrowsremoved)].classList.add("flooredbrick");
                    }
                });
                newindicestoadd.forEach(index =>{
                    cellsarr[index].classList.add("flooredbrick");
                });
                    
            });
        }, 200);
    
    }
};
