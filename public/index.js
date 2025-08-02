// #region variables and functions imported from external modules

// These contain the HTML DOM elements grabbed from the main index.html file
import * as docElems from "./globalVariables/docElems.js";
// These contain the 2D Array logic of the matrix pieces
import * as tetrisPieces from "./globalVariables/tetrisPieces.js";
// These contain the game's state variables
import {genVar} from "./globalVariables/generalVars.js";
// These contain the logic for touchscreens
import {setUpTouchControls} from "./touchScreen/touchScreen.js";
// These contain the general functions that can be used anywhere
import * as genFunc from "./functions/generalFunctions.js";

// #endregion variables and functions imported from external modules


setUpTouchControls();


// #region logic for the settings selection modal


docElems.noOfColsSel.addEventListener("change", (e) =>{
    
    genFunc.toggleCustomDisplay(e, docElems.customColsSel, docElems.labelCustomColsSel, docElems.customColInvalidFeedback);

});

docElems.noOfRowsSel.addEventListener("change", (e) =>{
    
    genFunc.toggleCustomDisplay(e, docElems.customRowsSel, docElems.labelCustomRowsSel, docElems.customRowInvalidFeedback);
});

docElems.gameSpeedSel.addEventListener("change", (e) =>{
   
    genFunc.toggleCustomDisplay(e, docElems.customSpeedSel, docElems.labelCustomSpeedSel, docElems.customSpeedInvalidFeedback);
});

docElems.customColsSel.addEventListener("change", ()=>{
    if (!docElems.customColsSel.disabled){

        genFunc.toggleInvalidFeedback(docElems.customColsSel, docElems.customColInvalidFeedback);
    }
});

docElems.customRowsSel.addEventListener("change", ()=>{
    if (!docElems.customRowsSel.disabled){
  
        genFunc.toggleInvalidFeedback(docElems.customRowsSel, docElems.customRowInvalidFeedback);
    }
});

docElems.customSpeedSel.addEventListener("change", ()=>{
    if (!docElems.customSpeedSel.disabled){

        genFunc.toggleInvalidFeedback(docElems.customSpeedSel, docElems.customSpeedInvalidFeedback);
    }
});

// #endregion logic for the settings selection modal

// #region game start functions
// Preserves browser form value validation for use in bootstrap
docElems.form.addEventListener("submit", (e) =>{
    'use strict'
    
    e.preventDefault();

    let valid=true;
    let checkCustomCol;
    let checkCustomRow;
    let checkCustomSpeed;
    
    // docElems.customColsSel.setCustomValidity("");
    // docElems.customRowsSel.setCustomValidity("");
    // docElems.customSpeedSel.setCustomValidity("");
    docElems.customColInvalidFeedback.classList.remove("invalid-feedback");
    docElems.customRowInvalidFeedback.classList.remove("invalid-feedback");
    docElems.customSpeedInvalidFeedback.classList.remove("invalid-feedback");

    if(docElems.noOfColsSel.value == "custom"){
        checkCustomCol = parseInt(docElems.customColsSel.value);
        if(!docElems.customColsSel.value || checkCustomCol <5 || checkCustomCol >50){
            valid = false;
            docElems.customColsSel.classList.add("is-invalid");
            docElems.customColInvalidFeedback.classList.add("invalid-feedback");
            docElems.customColInvalidFeedback.hidden = false;
        } else {
            docElems.customColsSel.classList.add("is-valid");
            docElems.customColInvalidFeedback.classList.remove("invalid-feedback");
            docElems.customColInvalidFeedback.hidden = true;
            genVar.noOfCols = checkCustomCol;
        }

        // docElems.customColsSel.setAttribute("required", "true");
    } else{
        genVar.noOfCols = parseInt(docElems.noOfColsSel.value);
        // docElems.customColsSel.removeAttribute("required");
    };



    if (docElems.noOfRowsSel.value  == "custom"){
        checkCustomRow = parseInt(docElems.customRowsSel.value);
        if(!docElems.customRowsSel.value || checkCustomRow <10 || checkCustomRow >100){
            valid = false;
            docElems.customRowsSel.classList.add("is-invalid");
            docElems.customRowInvalidFeedback.classList.add("invalid-feedback");
            docElems.customRowInvalidFeedback.hidden = false;
        } else {
            docElems.customRowsSel.classList.add("is-valid");
            docElems.customRowInvalidFeedback.classList.remove("invalid-feedback");
            docElems.customRowInvalidFeedback.hidden = true;
            genVar.noOfRows = checkCustomRow;
        }
        // docElems.customRowsSel.setAttribute("required", "true");
    } 
    
    else{
        genVar.noOfRows = parseInt(docElems.noOfRowsSel.value);
        // docElems.customRowsSel.removeAttribute("required");
    };

    
    if (docElems.gameSpeedSel.value  == "custom"){
        checkCustomSpeed = parseInt(docElems.customSpeedSel.value);
        if(!docElems.customSpeedSel.value || checkCustomSpeed <25 || checkCustomSpeed >5000){
            valid = false;
            docElems.customSpeedSel.classList.add("is-invalid");
            docElems.customSpeedInvalidFeedback.classList.add("invalid-feedback");
            docElems.customSpeedInvalidFeedback.hidden = false;
        } else {
            docElems.customSpeedSel.classList.add("is-valid");
            docElems.customSpeedInvalidFeedback.classList.remove("invalid-feedback");
            docElems.customSpeedInvalidFeedback.hidden = true;
            genVar.gameSpeed = checkCustomSpeed;
        }
        // docElems.customSpeedSel.setAttribute("required", "true");
    } else{
        genVar.gameSpeed = parseInt(docElems.gameSpeedSel.value);
       
    };

   
    if (valid == false){
        return;
    }
    else {
        
        genVar.isModalClosedBySubmit = true;
        docElems.modal.hide();
        startGame();
    }

});

docElems.startButton.addEventListener("click", () =>{
    // console.log("start btn was pressed");
    pauseGame();
});

docElems.modal._element.addEventListener("hidden.bs.modal", ()=>{
    // console.log("modal hidden was triggered");
    if(genVar.isModalClosedBySubmit){
        genVar.isModalClosedBySubmit = false;
    } else {
        unPauseGame();
    }
    
})


function startGame() {
    
        genVar.gameOver = false;
        genVar.paused = false;
        docElems.mainGridContainer.innerHTML = "";
        docElems.statusHeading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> <i class="bi bi-arrow-right-square"></i> <i class="bi bi-shift"></i> and Space / drag to play`;

        genVar.boardSize = genVar.noOfRows * genVar.noOfCols;
        generateGridCells();
        resetCurrentArrays();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        genVar.blockedPieces = [];
        genVar.score = 0;
        docElems.scoreValue.innerHTML = genVar.score;
        generateRandomPiece();
        genVar.pieceDownInterval && clearInterval(genVar.pieceDownInterval);
        genVar.pieceDownInterval = setInterval(movePieceDown, genVar.gameSpeed);
        
    
};

function pauseGame(){
    if(!genVar.paused && !genVar.gameOver){
        // console.log("pause game was triggered");
        genVar.paused = true;
        clearInterval(genVar.pieceDownInterval);
        genVar.pieceDownInterval = null;
    }
}

function unPauseGame(){
    if(!genVar.gameOver && genVar.paused){
        genVar.paused = false;
        
        (!genVar.pieceDownInterval) && (genVar.pieceDownInterval = setInterval(movePieceDown, genVar.gameSpeed));
    }
}

function generateGridCells(){

    for (let i=0; i<genVar.boardSize; i++){
        let newGridElement = document.createElement("div");
        newGridElement.classList.add("gridItem");
        newGridElement.id = i;
        docElems.mainGridContainer.appendChild(newGridElement);
    };

    docElems.mainGridContainer.style.gridTemplateColumns = `repeat(${genVar.noOfCols}, 1fr)`;
    docElems.mainGridContainer.style.gridTemplateRows = `repeat(${genVar.noOfRows}, 1fr)`;
    docElems.mainGridContainer.style.border= "transparent solid 5px";
    docElems.mainGridContainer.style.borderImage= `linear-gradient(to top, black, rgb(93, 45, 45))`;
    docElems.mainGridContainer.style.borderImageSlice= "1";

    let cellWidth = genVar.boardWidth/genVar.noOfCols;
    let boardHeight = genVar.boardWidth+(cellWidth*(genVar.noOfRows-genVar.noOfCols));
    // console.log("genVar.boardWidth is: ", genVar.boardWidth, "boardHeight is: ", boardHeight);
    
    var docStyle = document.createElement("style");
    docStyle.textContent = `
        @media (max-width: 600px) {
            #mainGridContainer{
                width: ${genVar.boardWidth/2}px;
                height: ${boardHeight/2}px;
            }
        }
        @media (min-width: 601px) {
            #mainGridContainer{
               width: ${genVar.boardWidth}px;
                height: ${boardHeight}px;
            }

        }   

    `;

    document.head.appendChild(docStyle);
    
    

 
    genVar.cellsArr = [...document.getElementsByClassName("gridItem")];
};

// #endregion game start functions

function resetCurrentArrays(){
    
    genVar.currentUserRefCellIndex = 0;
    clearFloatingBricks();
    clearFloorShiftBricks();
    genVar.currentUserArray = [];
    genVar.floorShiftArray = [];
    genVar.currentlySelectedPieceMatrix = [];
    
    
};


function clearFloatingBricks(){
    genVar.cellsArr.forEach(cell =>{
        cell.classList.remove("floatingBrick");
    })
};

function clearFloorShiftBricks(){
    genVar.cellsArr.forEach(cell =>{
        cell.classList.remove("floorCheckBrick");
    })
}

function addFloatingBricks(indexno) {
    genVar.cellsArr[indexno].classList.add("floatingBrick");
};

function addFlooredBricks(indexno) {
    genVar.cellsArr[indexno].classList.add("flooredBrick");
};

function addFloorShiftBricks(indexno) {
    genVar.cellsArr[indexno].classList.add("floorCheckBrick");
};

// #region piece generation logic

function generateUnblockedPiece(){

//    console.log("The blocked pieces are: ", genVar.blockedPieces);

    if(genVar.blockedPieces.length == pieces.length){
        // console.log("Game Over! None of the pieces can be generated in the grid space.");
        genVar.gameOver = true;
        docElems.statusHeading.innerHTML = "Game Over! Press start to play again";
        clearInterval(genVar.pieceDownInterval);
        genVar.pieceDownInterval=null;
    } else {
        for (piece of genVar.pieces){
            if (!genVar.blockedPieces.includes(piece)){
                switch(piece){
                    case "O":
                        generateOPiece();
                        break;
                    case "I":
                        generateIPiece();
                        break;
                    case "J":
                        generateJPiece();
                        break;
                    case "L":
                        generateLPiece();
                        break;
                    case "S":
                        generateSPiece();
                        break;
                    case "Z":
                        generateZPiece();
                        break;
                    case "T":
                        generateTPiece();
                        break;
                        
                }
                break;
            }
        }
    }

    
};

function checkBricksInColForDepth(colNo,depth){
    let bricksInCol = genVar.cellsArr.filter(cell=>{
        return (parseInt(cell.id) < (genVar.noOfCols * depth)) && (cell.classList.contains("flooredBrick"))
        && (parseInt(cell.id)%genVar.noOfCols == colNo)
    })
    // console.log("bricksInCol is: ", bricksInCol);
    // return bricksInCol.length>0 ? true:false;
    return bricksInCol;
};

function getAvailableColumns(pieceMatrix){

    let pieceWidth = pieceMatrix[0].length;

    let depthMap = genFunc.getDepthMap(pieceMatrix);
    let pieceHeight1 = Math.max(...depthMap);
    // console.log("pieceHeight1 is: ", pieceHeight1);

    let availableCols = [];

    // preliminary depth check for optimization
    let t1 = performance.now();
    let bricksInTheWayHeight1 = genVar.cellsArr.filter(cell =>{
        return ((parseInt(cell.id) < (genVar.noOfCols * pieceHeight1)) && (cell.classList.contains("flooredBrick")));
    });

    if (bricksInTheWayHeight1.length == 0){
        // console.log("There are no bricks of in the way in the max height of the piece from the top row");
        for (let i=0; i<(genVar.noOfCols-pieceWidth+1); i++){
            availableCols.push(i)
        }   
        
        // let t2 = performance.now();
        // console.log("Compute time taken in preliminary check is: ", (t2-t1));
        
    } else {

        for (let i=0; i<(genVar.noOfCols-pieceWidth+1);i++){
            let pieceFitCheck = depthMap.map((pieceColDepth, pieceColIndex)=>{
                let brickInCol = checkBricksInColForDepth((i+pieceColIndex), pieceColDepth);
                return brickInCol.length>0 ? true:false;
            });
            if(!pieceFitCheck.includes(true)){
                availableCols.push(i)
            }
        };
        // let t3 = performance.now();
        // console.log("Compute time taken in detailed check is: ", (t3-t1));
    }


    return availableCols;
    
};

function generateOPiece(){
    
    resetCurrentArrays();
    
    // always generate the item from the top-left corner of the piece matrix grid

    let availableCols = getAvailableColumns(tetrisPieces.OPieceMatrix);

    if (availableCols.length > 0){
        genVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        genVar.currentlySelectedPieceMatrix = tetrisPieces.OPieceMatrix;
        getCurrentUserArray();
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new O piece. availableCols is: ", availableCols);
        genVar.blockedPieces.push("O");
        generateUnblockedPiece();
    }
    
}


function generateIPiece(){

    
    resetCurrentArrays();
    // The top left most cell of an I piece can be generatated in any column in the top most row 
    genVar.currentUserRefCellIndex = Math.floor(Math.random()*(genVar.noOfCols));

    let availableCols = getAvailableColumns(tetrisPieces.IPieceMatrix);

    if (availableCols.length > 0){
        genVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        genVar.currentlySelectedPieceMatrix = tetrisPieces.IPieceMatrix;
        getCurrentUserArray();
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new I piece. availableCols is: ", availableCols);
        genVar.blockedPieces.push("I");
        generateUnblockedPiece();
    }


};

function generateJPiece(){

    resetCurrentArrays();

    // The top left most cell of an J piece matrix can be generatated in any column from 0 to (no of cols - 2) in the top most row 
   
    let availableCols = getAvailableColumns(tetrisPieces.JPieceMatrix);

    if (availableCols.length > 0){
        genVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        genVar.currentlySelectedPieceMatrix = tetrisPieces.JPieceMatrix;
        getCurrentUserArray();
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new J piece. availableCols is: ", availableCols);
        genVar.blockedPieces.push("J");
        generateUnblockedPiece();
    }
}

function generateLPiece(){

    resetCurrentArrays();
    // The top left most cell of an L piece can be generatated in any column from 0 to (no of cols - 2) in the top most row 
 
    let availableCols = getAvailableColumns(tetrisPieces.LPieceMatrix);

    if (availableCols.length > 0){
        genVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        genVar.currentlySelectedPieceMatrix = tetrisPieces.LPieceMatrix;
        getCurrentUserArray();
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new L piece. availableCols is: ", availableCols);
        genVar.blockedPieces.push("L");
        generateUnblockedPiece();
    }
}

function generateSPiece(){

    resetCurrentArrays();

    // The top left most cell of an S piece matrix can be generatated in any column from 0 to (no of cols - 3) in the top most row 
 
    let availableCols = getAvailableColumns(tetrisPieces.SPieceMatrix);

    if (availableCols.length > 0){
        genVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        genVar.currentlySelectedPieceMatrix = tetrisPieces.SPieceMatrix;
        getCurrentUserArray();
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new S piece. availableCols is: ", availableCols);
        genVar.blockedPieces.push("S");
        generateUnblockedPiece();
    }

}

function generateZPiece() {

    resetCurrentArrays();
    // The top left most cell of an Z piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 

    let availableCols = getAvailableColumns(tetrisPieces.ZPieceMatrix);

    if (availableCols.length > 0){
        genVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        genVar.currentlySelectedPieceMatrix = tetrisPieces.ZPieceMatrix;
        getCurrentUserArray();
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new Z piece. availableCols is: ", availableCols);
        genVar.blockedPieces.push("Z");
        generateUnblockedPiece();
    }
}

function generateTPiece() {

    resetCurrentArrays();
    // The top left most cell of an T piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 

    let availableCols = getAvailableColumns(tetrisPieces.TPieceMatrix);

    if (availableCols.length > 0){
        genVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        genVar.currentlySelectedPieceMatrix = tetrisPieces.TPieceMatrix;
        getCurrentUserArray();
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new T piece. availableCols is: ", availableCols);
        genVar.blockedPieces.push("T");
        generateUnblockedPiece();
    }
}

function getCurrentFloorShiftArray(){

    genVar.floorShiftArray = [];
    let highestRow = findFloor();
    let refIndRow = Math.floor(genVar.currentUserRefCellIndex/genVar.noOfCols);
    let noOfRowsToShift = highestRow - refIndRow - 1;

    genVar.floorShiftArray = genVar.currentUserArray.map(index =>{
        return (index+(noOfRowsToShift*genVar.noOfCols));
    })
    
}

function getCurrentUserArray(){
     genVar.currentUserArray = [];
    //  console.log("genVar.currentUserRefCellIndex value received inside getCurrentUserArray() is: ", genVar.currentUserRefCellIndex);
    //  The genVar.currentUserRefCellIndex is the starting index of the topmost cell in the matrix
    genVar.currentlySelectedPieceMatrix.forEach((row, rowAdd)=>{
        // For toprow, we need to add +1 for each subsequent item from the genVar.currentUserRefCellIndex
        row.forEach((cell,colIndex)=>{
            // console.log("In currentarraygen loop, rowindex is noW: ", rowAdd, " ,column index is now: ", colIndex, " and truthy is: ", cell);
            // only if the value is "True" is a value added to the array
            if(cell){
                genVar.currentUserArray.push(genVar.currentUserRefCellIndex + (rowAdd*genVar.noOfCols) + colIndex);
            }
        })
    });
    getCurrentFloorShiftArray();
    
}


function generateRandomPiece(){
    let randomSel = Math.floor(Math.random() * 7);
    // console.log("randomSel number is: ", randomSel);
    
    switch(randomSel){
        case 0:
        generateOPiece();
        break;

        case 1:
        generateIPiece();
        break;

        case 2:
        generateJPiece();
        break;

        case 3:
        generateLPiece();
        break;

        case 4:
        generateSPiece();
        break;

        case 5:
        generateZPiece();
        break;

        case 6:
        generateTPiece();
        break;
    }
}



// #endregion piece generation logic

// #region logic for left and right movement
function movePieceRight(){
    getCurrentUserArray();
   
    // The right most column in all the elements from currentUserArray is used to check for right wall
    let colMap = genVar.currentUserArray.map(index =>{
        return (index%genVar.noOfCols);
    })
    let rightmostCol = Math.max(...colMap);

    let flooredPiecesCheck = genVar.currentUserArray.filter(index =>{
        if(genVar.cellsArr[index+1]){
        return genVar.cellsArr[index+1].classList.contains("flooredBrick");
        }
    })
   
    
    if (!(rightmostCol == (genVar.noOfCols -1)) && !(flooredPiecesCheck.length >0)){
        clearFloatingBricks();
        clearFloorShiftBricks();
        // console.log("genVar.currentUserRefCellIndex before movePieceRight is: ", genVar.currentUserRefCellIndex);
        genVar.currentUserRefCellIndex++;
        // console.log("genVar.currentUserRefCellIndex after movePieceRight is: ", genVar.currentUserRefCellIndex);
        getCurrentUserArray();
        
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
        
    } else {
        // console.log("The piece has hit a right wall");
    }
};

function movePieceLeft(){
    getCurrentUserArray();
   // The left most column in all the elements from currentUserArray is used to check for left wall
    let colMap = genVar.currentUserArray.map(index =>{
        return (index%genVar.noOfCols);
    })
    let leftmostCol = Math.min(...colMap);

    let flooredPiecesCheck = genVar.currentUserArray.filter(index =>{
        if(genVar.cellsArr[index-1]){
        return genVar.cellsArr[index-1].classList.contains("flooredBrick");
        }
    })


    if(!(leftmostCol == 0) && !(flooredPiecesCheck.length >0) ){
        clearFloatingBricks();
        clearFloorShiftBricks();
        // console.log("genVar.currentUserRefCellIndex before movePieceLeft is: ", genVar.currentUserRefCellIndex);
        genVar.currentUserRefCellIndex--;
        // console.log("genVar.currentUserRefCellIndex after movePieceLeft is: ", genVar.currentUserRefCellIndex);
        getCurrentUserArray();
        
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
        
    } else {
        // console.log("The piece has hit a left wall");
    }
};

function rotatePieceClockwise(){

    getCurrentUserArray();
    let prevUserArr = genVar.currentUserArray;

    let currentMatrixLength = genVar.currentlySelectedPieceMatrix[0].length;
    let currentMatrixHeight = genVar.currentlySelectedPieceMatrix.length;
    let dimensionDifference = Math.abs(currentMatrixLength - currentMatrixHeight);

    let colMap = genVar.currentUserArray.map(index =>{
        return (index%genVar.noOfCols);
    });

    let rowMap = genVar.currentUserArray.map(index =>{
        return (Math.floor(index/genVar.noOfCols));
    });

    let rightmostCol = Math.max(...colMap);
    
    let bottommostRow = Math.max(...rowMap);
    
    let rightOverflowCheck = rightmostCol + dimensionDifference;
    let bottomOverflowCheck = bottommostRow + dimensionDifference;

    // Right walls check

    let leftCascading = false;
    
    if( (rightOverflowCheck > (genVar.noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
        genVar.currentUserRefCellIndex -= rightOverflowCheck-(genVar.noOfCols-1);
        leftCascading = true;
    }

    // Bottom walls check
    let upperCascading = false;
    
     if((bottomOverflowCheck > (genVar.noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
        genVar.currentUserRefCellIndex -= ((bottomOverflowCheck-(genVar.noOfRows-1))*genVar.noOfCols);
        upperCascading = true;
    }

    let checkWallInRotationMat = genFunc.rotateMatrixClockwise(genVar.currentlySelectedPieceMatrix);
    genVar.currentlySelectedPieceMatrix = checkWallInRotationMat;

    getCurrentUserArray();
    let bricksInTheWay = genVar.currentUserArray.filter(index =>{
        return genVar.cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert 
        genVar.currentUserArray = prevUserArr;
        let checkWallInRotationMat = genFunc.rotateMatrixAntiClockwise(genVar.currentlySelectedPieceMatrix);
        genVar.currentlySelectedPieceMatrix = checkWallInRotationMat;
        if(leftCascading == true){
            genVar.currentUserRefCellIndex += rightOverflowCheck-(genVar.noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            genVar.currentUserRefCellIndex += ((bottomOverflowCheck-(genVar.noOfRows-1))*genVar.noOfCols);
            upperCascading = false;
        }

    }

    clearFloatingBricks();
    clearFloorShiftBricks();
    genVar.currentUserArray.forEach(addFloatingBricks);
    genVar.floorShiftArray.forEach(addFloorShiftBricks);
}

function rotatePieceAntiClockwise(){

    getCurrentUserArray();
    let prevUserArr = genVar.currentUserArray;

    let currentMatrixLength = genVar.currentlySelectedPieceMatrix[0].length;
    let currentMatrixHeight = genVar.currentlySelectedPieceMatrix.length;
    let dimensionDifference = Math.abs(currentMatrixLength - currentMatrixHeight);

    let colMap = genVar.currentUserArray.map(index =>{
        return (index%genVar.noOfCols);
    });

    let rowMap = genVar.currentUserArray.map(index =>{
        return (Math.floor(index/genVar.noOfCols));
    });

    let rightmostCol = Math.max(...colMap);
    
    let bottommostRow = Math.max(...rowMap);
    
    let rightOverflowCheck = rightmostCol + dimensionDifference;
    let bottomOverflowCheck = bottommostRow + dimensionDifference;

    // Right walls check

    let leftCascading = false;
    
    if( (rightOverflowCheck > (genVar.noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
        genVar.currentUserRefCellIndex -= rightOverflowCheck-(genVar.noOfCols-1);
        leftCascading = true;
    }

    // Bottom walls check
    let upperCascading = false;
    
     if((bottomOverflowCheck > (genVar.noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
        genVar.currentUserRefCellIndex -= ((bottomOverflowCheck-(genVar.noOfRows-1))*genVar.noOfCols);
        upperCascading = true;
    }

    let checkWallInRotationMat = genFunc.rotateMatrixAntiClockwise(genVar.currentlySelectedPieceMatrix);
    genVar.currentlySelectedPieceMatrix = checkWallInRotationMat;

    getCurrentUserArray();
    let bricksInTheWay = genVar.currentUserArray.filter(index =>{
        return genVar.cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert 
        genVar.currentUserArray = prevUserArr;
        let checkWallInRotationMat = genFunc.rotateMatrixClockwise(genVar.currentlySelectedPieceMatrix);
        genVar.currentlySelectedPieceMatrix = checkWallInRotationMat;
        if(leftCascading == true){
            genVar.currentUserRefCellIndex += rightOverflowCheck-(genVar.noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            genVar.currentUserRefCellIndex += ((bottomOverflowCheck-(genVar.noOfRows-1))*genVar.noOfCols);
            upperCascading = false;
        }

    }

    clearFloatingBricks();
    clearFloorShiftBricks();
    genVar.currentUserArray.forEach(addFloatingBricks);
    genVar.floorShiftArray.forEach(addFloorShiftBricks);
}

// #endregion logic for left and right movement

function movePieceDown() {
    
    clearFloatingBricks();
    clearFloorShiftBricks();
    if(!checkFloor() ){
        
        genVar.currentUserRefCellIndex += genVar.noOfCols;
        getCurrentUserArray();
        
      
        
        genVar.currentUserArray.forEach(addFloatingBricks);
        genVar.floorShiftArray.forEach(addFloorShiftBricks);
        
    }else {
        genVar.currentUserArray.forEach(addFlooredBricks);
        
        checkBrickedRows();
        
        
    }
};

function instaDrop() {

    let floorRow = findFloor();
    let refRow = Math.floor(genVar.currentUserRefCellIndex/genVar.noOfCols);
    let noOfRowsToShift = floorRow - refRow - 1;
    genVar.currentUserRefCellIndex += (noOfRowsToShift*genVar.noOfCols);
    getCurrentUserArray();
    genVar.currentUserArray.forEach(addFlooredBricks);
    checkBrickedRows();
}

function checkFloor(){
    
    getCurrentUserArray();
    let floorHitCells = genVar.currentUserArray.filter(cell =>{
       return ((cell + genVar.noOfCols) >= genVar.boardSize) || (genVar.cellsArr[cell + genVar.noOfCols].classList.contains("flooredBrick"))       
    });

    // console.log("floorhit cells returned is: ", floorHitCells);
    return floorHitCells.length >0 ? true : false;
};

function findFloor(){
    
    let relevantCellsIndex = [];
  

    // If there is a 'gap' in between two indices vertically, it is relevant
    genVar.currentUserArray.forEach(index =>{
        if (!genVar.currentUserArray.includes((parseInt(index)+genVar.noOfCols))){
            relevantCellsIndex.push(index);
        }
    })

    let refIndRow = Math.floor(genVar.currentUserRefCellIndex/genVar.noOfCols);

    let floorMap = relevantCellsIndex.map(releIndex=>{
        let highestFloorRow;
        let releIndexRow = Math.floor(releIndex/genVar.noOfCols);
        let extraDepth = releIndexRow - refIndRow;
        let brickCheck = genVar.cellsArr.filter(cell =>{
            return((parseInt(cell.id) % genVar.noOfCols == releIndex % genVar.noOfCols) && 
            (parseInt(cell.id) > releIndex) && (cell.classList.contains("flooredBrick")))
        })
        if(brickCheck.length>0){
            let brickRowMap = brickCheck.map(brickInWay =>{
                return Math.floor(parseInt(brickInWay.id)/genVar.noOfCols);
            });
            highestFloorRow = Math.min(...brickRowMap);
        } else {
            highestFloorRow = genVar.noOfRows;
        }
        // The result is shifted to be as if being just below the refIndRow
        return (highestFloorRow-extraDepth);
    })
    // console.log("floorMap for the piece is: ", floorMap);
    return Math.min(...floorMap);
    
};

document.addEventListener("keydown", (e)=>{
    
    if(!genVar.gameOver && !genVar.paused){
    
        if (e.target.tagName == "INPUT") return;

        e.preventDefault();
        if(e.key == "ArrowLeft"){
            movePieceLeft();
        }

        if(e.key == "ArrowRight"){
            movePieceRight();
        }

        if(e.key == "ArrowDown"){
            movePieceDown();
        }

        if(e.key == " ") {

            rotatePieceClockwise()
        }

        if(e.key == "ArrowUp") {
            
            instaDrop();
        }

        if(e.key == "Shift") {
            rotatePieceAntiClockwise();
        }
    }
    
});

docElems.moveLeftBtn.addEventListener("click", () => {
    if(!genVar.gameOver && !genVar.paused){
        movePieceLeft();
    }
});

docElems.moveRightBtn.addEventListener("click", () => {
    if(!genVar.gameOver && !genVar.paused){
        movePieceRight();
    }
});

docElems.moveDownBtn1.addEventListener("mousedown", () => {
    if(!genVar.gameOver && !genVar.paused){
        movePieceDown();
    }
});

docElems.moveDownBtn2.addEventListener("mousedown", () => {
    if(!genVar.gameOver && !genVar.paused){
        movePieceDown();
    }
});

docElems.rotateClockwiseBtn.addEventListener("click", () => {
    if(!genVar.gameOver && !genVar.paused){
        rotatePieceClockwise();
    }
});

docElems.instaDownBtn1.addEventListener("click", () => {
    if(!genVar.gameOver && !genVar.paused){
        instaDrop();
    }
});

docElems.instaDownBtn2.addEventListener("click", () => {
    if(!genVar.gameOver && !genVar.paused){
        instaDrop();
    }
});


docElems.rotateAntiClockwiseBtn.addEventListener("click", () => {
    if(!genVar.gameOver && !genVar.paused){
        rotatePieceAntiClockwise();
    }
});

function getRowsOfBricked(){
    let rowsOfBricked = [];
    let brickedCells = [...document.getElementsByClassName("flooredBrick")];
    brickedCells.forEach(cell =>{
        // rowsOfBricked collects the row numbers of all the bricked cells
        rowsOfBricked.push(Math.floor(parseInt(cell.id)/genVar.noOfCols));
    });
    return rowsOfBricked;
}

function getFullRowsArray(rowsOfBricked){
    // uniqueRowsArr stores the unique rows with atleast one bricked cell
    let uniqueRowsArr = [...new Set(rowsOfBricked)];
    // fullRowsArr stores the unique rows with all cells bricked in it
    let fullRowsArr = [];

    uniqueRowsArr.forEach(uniqueRowNumber =>{
   
        let countArr = rowsOfBricked.filter(row =>{
            return (row == uniqueRowNumber);
        });
        if (countArr.length == genVar.noOfCols){
            fullRowsArr.push(uniqueRowNumber);
        }
    });

    return fullRowsArr;
};

function clearFullRows(fullRowsArr){
    fullRowsArr.forEach(fullRow =>{
            let startingInd = parseInt(fullRow) * genVar.noOfCols;
            let finishingInd = startingInd + (genVar.noOfCols-1);

            for (let i=startingInd; i <= finishingInd; i++){
                genVar.cellsArr[i].classList.remove("flooredBrick");
            };
            genVar.score++;
            docElems.scoreValue.innerHTML = genVar.score;
        });
}

function shiftBricks(fullRowsArr){

    // Sorting array numerically in ascending order (top of grid to bottom)
    fullRowsArr.sort(function(a,b){return a - b});
            
    let brickedCells = [...document.getElementsByClassName("flooredBrick")];
    let newIndicesToAdd = [];
    brickedCells.forEach(cell =>{
        let cellIndex = parseInt(cell.id);
        let cellRow = Math.floor(cellIndex/genVar.noOfCols);

        let shiftBy = fullRowsArr.filter(fullRow => fullRow > cellRow).length;
        if (shiftBy >0){
            cell.classList.remove("flooredBrick");
            let newIndex = cellIndex + (shiftBy*genVar.noOfCols);
            newIndicesToAdd.push(newIndex);
        }
    });
    newIndicesToAdd.forEach(index =>{
            genVar.cellsArr[index].classList.add("flooredBrick");
        });            
       
};

function checkBrickedRows(){

    let rowsOfBricked = getRowsOfBricked();

    // Checking for gameOver condition
    if(rowsOfBricked.includes(0)){
        // console.log("Game over! The bricks have hit the ceiling!");
        clearInterval(genVar.pieceDownInterval);
        genVar.pieceDownInterval=null;
        genVar.gameOver = true;
        docElems.statusHeading.innerHTML = "Game Over! Press start to play again";
    };

    if(!genVar.gameOver){
        
        let fullRowsArr = getFullRowsArray(rowsOfBricked);
        
        // console.log("fullRowsArr.length >0 was registered ");
        
        clearFullRows(fullRowsArr);

            // The floored bricks would still be floating in place b/w the rows which are just cleared needs to cascade down
        pauseGame();
        setTimeout(() => {
            shiftBricks(fullRowsArr);
            resetCurrentArrays();
            generateRandomPiece();
            unPauseGame();
            
        },200);           
    
    }
};
