var maingridcontainer = document.getElementById("maingridcontainer");
var gameover=true;
var noofcols = 6;
var noofrows = 10;
var boardsize = noofrows * noofcols;
var gamespeed = 100;
var currentlyselectedpiece;
var currentlyselectedpiecematrix = [];
// var currentuserrefrow;
var currentuserrefcellindex;


var currentuserarray = [];
var cellsarr = [];
var pieces = ["O", "I", "J", "L", "S", "Z", "T"];
var blockedpieces = [];

const matrix = [[1,2,3], [4,5,6], [7,8,9]];

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


function startgame() {
    if((gameover)){
        // gameover = false;
        maingridcontainer.innerHTML = "";
        generategridcells();
        resetcurrentarrays();
        // generaterandompiece();
        // var gameintereval = setInterval(movepiecedown, 100);
    }
};

function resetcurrentarrays(){
    // Opiece = [];
    // currentuserrefrow = 0;
    currentuserrefcellindex = 0;
    clearfloatingbricks();
    currentuserarray = [];
    currentlyselectedpiecematrix = [];
    blockedpieces = [];
    
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
   

    if(blockedpieces.length == pieces.length){
        console.log("None of the pieces can be generated in the grid.");
        gameover = true;
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

    
}

function getavailablecolumns(piece){

     let pieceheight;
     let piecewidth;
     
     switch(piece){
        case "O":
            pieceheight = 2;
            piecewidth = 2;
            break;
        case "I":
            generateIpiece();
            pieceheight = 4;
            piecewidth = 1;
        case "J":
            pieceheight = 3;
            piecewidth = 2;
            break;
        case "L":
            pieceheight = 3;
            piecewidth = 2;
            break;
        case "S":
            pieceheight = 2;
            piecewidth = 3;
            break;
        case "Z":
            pieceheight = 2;
            piecewidth = 3;
            break;
        case "T":
            pieceheight = 2;
            piecewidth = 3;
            break;
     }

// check for any obstructions from floored bricks that would coincide with the location of the cells in the piece
    let bricksintheway = cellsarr.filter(cell =>{
        return ((parseInt(cell.id) < (noofcols * pieceheight)) && (cell.classList.contains("flooredbrick")));
    });

    let colbricksinway = bricksintheway.map(brickcell => parseInt(brickcell.id)%noofcols);

    let pieceheightemptycols = [];
    let availablecols = [];

    
    // Need to check all the columns here
    for (let i=0; i<(noofcols); i++){
        if(!colbricksinway.includes(i)){
            pieceheightemptycols.push(i);
        }
    };

    // The top left most cell of an O piece can be generatated in any column from 0 to (no of cols-2) in the top most row 
    // currentuserrefcellindex = Math.floor(Math.random()*(noofcols-1));

    console.log("pieceheightemptycols is: ", pieceheightemptycols);

    for (let i=0; i<pieceheightemptycols.length; i++){
        
            if(piecewidth == 1){
                availablecols.push(pieceheightemptycols[i])
            }
            if(piecewidth == 2){
                if(parseInt(pieceheightemptycols[i+1])){
                    if((parseInt(pieceheightemptycols[i]) + 1) == parseInt(pieceheightemptycols[i+1])){
                        availablecols.push(pieceheightemptycols[i])
                    }
                }
            }
            if(piecewidth == 3){
                if(parseInt(pieceheightemptycols[i+1]) && parseInt(pieceheightemptycols[i+2])){
                    if((parseInt(pieceheightemptycols[i]) + 1) == parseInt(pieceheightemptycols[i+1])
                        && (parseInt(pieceheightemptycols[i]) + 2) == parseInt(pieceheightemptycols[i+2])){
                        availablecols.push(pieceheightemptycols[i])
                    }
                }
            }
        
    };
    console.log("availablecols is: ", availablecols);
    return availablecols;


};

function generateOpiece(){
    // currentlyselectedpiece = "O";
    resetcurrentarrays();
    
    

    // always generate the item from the top-left corner of the grid

    let Opiecematrix = [
        [true, true],
        [true, true]    
    ];

    
    let availablecols = getavailablecolumns("O");

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Opiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        console.log("There is no space to generate new piece. availablecols is: ", availablecols);
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

    let Ipiecematrix = [
        [true],
        [true],
        [true],
        [true]       
    ];


    let availablecols = getavailablecolumns("I");

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Ipiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        console.log("There is no space to generate new piece. availablecols is: ", availablecols);
        blockedpieces.push("I");
        generateunblockedpiece();
    }


};

function generateJpiece(){

    resetcurrentarrays();

    // The top left most cell of an J piece matrix can be generatated in any column from 0 to (no of cols - 2) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-1)));

    let Jpiecematrix = [
        [false, true],
        [false, true],
        [true, true]       
    ];

    

    let availablecols = getavailablecolumns("J");

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Jpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        console.log("There is no space to generate new piece. availablecols is: ", availablecols);
        blockedpieces.push("J");
        generateunblockedpiece();
    }
}

function generateLpiece(){

    resetcurrentarrays();
    // The top left most cell of an L piece can be generatated in any column from 0 to (no of cols - 2) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-1)));



    let Lpiecematrix = [
        [true, false],
        [true, false],
        [true, true]       
    ];

    let availablecols = getavailablecolumns("L");

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Lpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        console.log("There is no space to generate new piece. availablecols is: ", availablecols);
        blockedpieces.push("L");
        generateunblockedpiece();
    }
}

function generateSpiece(){

    resetcurrentarrays();

    // The top left most cell of an S piece matrix can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-2)));

    

    let Spiecematrix = [
        [false, true, true],
        [true, true, false]     
    ]

    let availablecols = getavailablecolumns("S");

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Spiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        console.log("There is no space to generate new piece. availablecols is: ", availablecols);
        blockedpieces.push("S");
        generateunblockedpiece();
    }

}

function generateZpiece() {

    resetcurrentarrays();
    // The top left most cell of an Z piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-2)));

    let Zpiecematrix = [
        [true, true, false],
        [false, true, true]     
    ]

    let availablecols = getavailablecolumns("Z");

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Zpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        console.log("There is no space to generate new piece. availablecols is: ", availablecols);
        blockedpieces.push("Z");
        generateunblockedpiece();
    }
}

function generateTpiece() {

    resetcurrentarrays();
    // The top left most cell of an T piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentuserrefcellindex = Math.floor((Math.random()*(noofcols-2)));

    let Tpiecematrix = [
        [true, true, true],
        [false, true, false]  
    ]

    let availablecols = getavailablecolumns("T");

    if (availablecols.length > 0){
        currentuserrefcellindex = availablecols[Math.floor(Math.random()*(availablecols.length))];
        currentlyselectedpiecematrix = Tpiecematrix;
        getcurrentuserarray();
        currentuserarray.forEach(addfloatingbricks);
    } else {
        console.log("There is no space to generate new piece. availablecols is: ", availablecols);
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
        // resetcurrentarrays();
        checkbrickedrows();
        resetcurrentarrays();
        generaterandompiece();
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
    

};

// movepieceright();
// movepieceleft();
