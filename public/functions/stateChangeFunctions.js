// This module contains functions that alters the game's state variables

// The module imported below contains the 2D Array logic of the matrix pieces
import * as tetrisPieces from "../globalVariables/tetrisPieces.js";
// The module imported below contains the game's state variables
import {stateVar} from "../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../globalVariables/docElems.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "./generalFunctions.js";
// The module imported below contains functions that perform calculations based on the state of the game
import * as stateEnquiry from "./stateEnquiry.js";


export function pauseGame(){
    if(!stateVar.paused && !stateVar.gameOver){

        stateVar.paused = true;
        clearInterval(stateVar.pieceDownInterval);
        stateVar.pieceDownInterval = null;
    }
};

export function getCurrentFloorGuideArray(){

    stateVar.floorGuideArray = [];
    let highestRow = stateEnquiry.findFloor();
    let refIndRow = Math.floor(stateVar.currentUserRefCellIndex/stateVar.noOfCols);
    let noOfRowsToShift = highestRow - refIndRow - 1;

    stateVar.floorGuideArray = stateVar.currentUserArray.map(index =>{
        return (index+(noOfRowsToShift*stateVar.noOfCols));
    })
    
}

export function updateCurrentUserArray(){
     stateVar.currentUserArray = [];
    
    //  The stateVar.currentUserRefCellIndex is the starting index of the topmost cell in the matrix
    stateVar.currentlySelectedPieceMatrix.forEach((row, rowAdd)=>{
        // For toprow, we need to add +1 for each subsequent item from the stateVar.currentUserRefCellIndex
        row.forEach((cell,colIndex)=>{
            // only if the piece matrix's entry value is "True" is a value added to stateVar.currentUserArray
            if(cell){
                stateVar.currentUserArray.push(stateVar.currentUserRefCellIndex + (rowAdd*stateVar.noOfCols) + colIndex);
            }
        })
    });
    getCurrentFloorGuideArray();
    
}


export function clearFullRows(fullRowsArr){
    if (fullRowsArr.length >0){
        docElems.rowCleared.currentTime=0;
        docElems.rowCleared.play();
        fullRowsArr.forEach(fullRow =>{
            let startingInd = parseInt(fullRow) * stateVar.noOfCols;
            let finishingInd = startingInd + (stateVar.noOfCols-1);

            for (let i=startingInd; i <= finishingInd; i++){
                stateVar.cellsArr[i].classList.remove("flooredBrick");
            };
            stateVar.score++;
            docElems.scoreValue.innerHTML = stateVar.score;
            if(stateVar.score>stateVar.highscore){
                stateVar.highscore = stateVar.score;
            };
            docElems.highScoreValue.innerHTML = stateVar.highscore;
        });
    };
};

export function shiftBricks(fullRowsArr){
    if(fullRowsArr.length>0){
        // Sorting array numerically in ascending order (top of grid to bottom)
        fullRowsArr.sort(function(a,b){return a - b});        
        let brickedCells = [...document.getElementsByClassName("flooredBrick")];
        let newIndicesToAdd = [];
        brickedCells.forEach(cell =>{
            let cellIndex = parseInt(cell.id);
            let cellRow = Math.floor(cellIndex/stateVar.noOfCols);

            let shiftBy = fullRowsArr.filter(fullRow => fullRow > cellRow).length;
            if (shiftBy >0){
                cell.classList.remove("flooredBrick");
                let newIndex = cellIndex + (shiftBy*stateVar.noOfCols);
                newIndicesToAdd.push(newIndex);
            }
        });
        newIndicesToAdd.forEach(index =>{
                stateVar.cellsArr[index].classList.add("flooredBrick");
        });
    };            
       
};

function handleClassClearing(stateArray, removeClassName){

    let nonexistentindex=false;
    stateArray.forEach(index =>{
        if(stateVar.cellsArr[index]){
            stateVar.cellsArr[index].classList.remove(removeClassName);
        } else {
            nonexistentindex=true;
        };
    });
    if(nonexistentindex){
        stateVar.cellsArr.forEach(cell =>{
            cell.classList.remove(removeClassName);
        })
    };

};

export function clearFloatingBricks(){

    handleClassClearing(stateVar.currentUserArray, "floatingBrick")
};

export function clearFloorGuideBricks(){

    handleClassClearing(stateVar.floorGuideArray, "floorCheckBrick")
};

export function addFloatingBricks(indexno) {
    stateVar.cellsArr[indexno].classList.add("floatingBrick");
};

export function addFlooredBricks(indexno) {
    stateVar.cellsArr[indexno].classList.add("flooredBrick");
};

export function addFloorGuideBricks(indexno) {
    stateVar.cellsArr[indexno].classList.add("floorCheckBrick");
};

export function resetCurrentArrays(){
    
    clearFloatingBricks();
    clearFloorGuideBricks();
    stateVar.currentUserRefCellIndex = 0;
    stateVar.currentUserArray = [];
    stateVar.floorGuideArray = [];
    stateVar.currentlySelectedPieceMatrix = [];
};

export function handleKeyPress(e){

    if(!stateVar.gameOver && !stateVar.paused){
    
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
            !stateVar.swapSpaceBar ? instaDrop() : rotatePieceClockwise();
            
        }

        if(e.key == "ArrowUp") {
            stateVar.swapSpaceBar ? instaDrop() : rotatePieceClockwise();
        }

        if(e.key == "Shift") {
            rotatePieceAntiClockwise();
        }
    }
};

function handleEndGame(classListToAdd){

    document.body.classList.add(classListToAdd);
    
    if(classListToAdd =="newHighScore"){
        docElems.statusHeading.innerHTML = "Congrats! New High Score! Press start to play again";
        setTimeout(()=> document.body.classList.remove(classListToAdd), 500);
    } else {
        docElems.statusHeading.innerHTML = "Game Over! Press start to play again";
        setTimeout(()=> document.body.classList.remove(classListToAdd), 200);
    }
    
    
};

export async function checkBrickedRows(){

    let rowsOfBricked = stateEnquiry.getRowsOfBricked();

    // Checking for gameOver condition
    if(rowsOfBricked.includes(0)){
        
        clearInterval(stateVar.pieceDownInterval);
        stateVar.pieceDownInterval=null;
        stateVar.gameOver = true;
        await docElems.mainLoopMusic.pause();
        if(stateVar.score >= stateVar.highscore){
            
            await docElems.newHighScoreSound.play();
            handleEndGame("newHighScore");
            
        } else{
            
            await docElems.gameOverSound.play();
            handleEndGame("gameOver");
            
        }
        
    };

    if(!stateVar.gameOver){
        
        let fullRowsArr = stateEnquiry.getFullRowsArray(rowsOfBricked);
        
       
        
        clearFullRows(fullRowsArr);

            // The floored bricks would still be floating in place b/w the rows which are just cleared needs to cascade down
        pauseGame();
        setTimeout(() => {
            shiftBricks(fullRowsArr);
            resetCurrentArrays();
            // generateRandomPiece();
            generateNextPiece();
            selectNextPiece();
            unPauseGame();
            
        },200);           
    
    }
};

export function buttonClickValidation(movefunction){
    if(!stateVar.gameOver && !stateVar.paused){
        movefunction();
    }
};

// #region logic for piece movement

export function movePieceRight(){
    updateCurrentUserArray();
   
    // The right most column in all the elements from currentUserArray is used to check for right wall
    let colMap = stateVar.currentUserArray.map(index =>{
        return (index%stateVar.noOfCols);
    })
    let rightmostCol = Math.max(...colMap);

    let flooredPiecesCheck = stateVar.currentUserArray.filter(index =>{
        if(stateVar.cellsArr[index+1]){
        return stateVar.cellsArr[index+1].classList.contains("flooredBrick");
        }
    })
   
    
    if (!(rightmostCol == (stateVar.noOfCols -1)) && !(flooredPiecesCheck.length >0)){
        clearFloatingBricks();
        clearFloorGuideBricks();
        stateVar.currentUserRefCellIndex++;
        updateCurrentUserArray();
        stateVar.currentUserArray.forEach(addFloatingBricks);
        stateVar.floorGuideArray.forEach(addFloorGuideBricks);
        
    } else {
        // console.log("The piece has hit a right wall");
    }
};

export function movePieceLeft(){
    updateCurrentUserArray();
   // The left most column in all the elements from currentUserArray is used to check for left wall
    let colMap = stateVar.currentUserArray.map(index =>{
        return (index%stateVar.noOfCols);
    })
    let leftmostCol = Math.min(...colMap);

    let flooredPiecesCheck = stateVar.currentUserArray.filter(index =>{
        if(stateVar.cellsArr[index-1]){
        return stateVar.cellsArr[index-1].classList.contains("flooredBrick");
        }
    })


    if(!(leftmostCol == 0) && !(flooredPiecesCheck.length >0) ){
        clearFloatingBricks();
        clearFloorGuideBricks();
       
        stateVar.currentUserRefCellIndex--;
       
        updateCurrentUserArray();
        
        stateVar.currentUserArray.forEach(addFloatingBricks);
        stateVar.floorGuideArray.forEach(addFloorGuideBricks);
        
    } else {
        // console.log("The piece has hit a left wall");
    }
};

export function rotatePieceClockwise(){
    docElems.pieceRotate.currentTime = 0;
    docElems.pieceRotate.play();
    clearFloatingBricks();
    clearFloorGuideBricks();
    updateCurrentUserArray();
    let prevUserArr = stateVar.currentUserArray;

    let currentMatrixLength = stateVar.currentlySelectedPieceMatrix[0].length;
    let currentMatrixHeight = stateVar.currentlySelectedPieceMatrix.length;
    let dimensionDifference = Math.abs(currentMatrixLength - currentMatrixHeight);

    let colMap = stateVar.currentUserArray.map(index =>{
        return (index%stateVar.noOfCols);
    });

    let rowMap = stateVar.currentUserArray.map(index =>{
        return (Math.floor(index/stateVar.noOfCols));
    });

    let rightmostCol = Math.max(...colMap);
    
    let bottommostRow = Math.max(...rowMap);
    
    let rightOverflowCheck = rightmostCol + dimensionDifference;
    let bottomOverflowCheck = bottommostRow + dimensionDifference;

    // Right walls check

    let leftCascading = false;
    
    if( (rightOverflowCheck > (stateVar.noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
        stateVar.currentUserRefCellIndex -= rightOverflowCheck-(stateVar.noOfCols-1);
        leftCascading = true;
    }

    // Bottom walls check
    let upperCascading = false;
    
     if((bottomOverflowCheck > (stateVar.noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
        stateVar.currentUserRefCellIndex -= ((bottomOverflowCheck-(stateVar.noOfRows-1))*stateVar.noOfCols);
        upperCascading = true;
    }

    let checkWallInRotationMat = genFunc.rotateMatrixClockwise(stateVar.currentlySelectedPieceMatrix);
    stateVar.currentlySelectedPieceMatrix = checkWallInRotationMat;

    updateCurrentUserArray();
    let bricksInTheWay = stateVar.currentUserArray.filter(index =>{
        return stateVar.cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert 
        stateVar.currentUserArray = prevUserArr;
        let checkWallInRotationMat = genFunc.rotateMatrixAntiClockwise(stateVar.currentlySelectedPieceMatrix);
        stateVar.currentlySelectedPieceMatrix = checkWallInRotationMat;
        if(leftCascading == true){
            stateVar.currentUserRefCellIndex += rightOverflowCheck-(stateVar.noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            stateVar.currentUserRefCellIndex += ((bottomOverflowCheck-(stateVar.noOfRows-1))*stateVar.noOfCols);
            upperCascading = false;
        }

    }

    
    stateVar.currentUserArray.forEach(addFloatingBricks);
    stateVar.floorGuideArray.forEach(addFloorGuideBricks);
}

export function rotatePieceAntiClockwise(){

    docElems.pieceRotate.currentTime = 0;
    docElems.pieceRotate.play();
    clearFloatingBricks();
    clearFloorGuideBricks();
    updateCurrentUserArray();
    let prevUserArr = stateVar.currentUserArray;

    let currentMatrixLength = stateVar.currentlySelectedPieceMatrix[0].length;
    let currentMatrixHeight = stateVar.currentlySelectedPieceMatrix.length;
    let dimensionDifference = Math.abs(currentMatrixLength - currentMatrixHeight);

    let colMap = stateVar.currentUserArray.map(index =>{
        return (index%stateVar.noOfCols);
    });

    let rowMap = stateVar.currentUserArray.map(index =>{
        return (Math.floor(index/stateVar.noOfCols));
    });

    let rightmostCol = Math.max(...colMap);
    
    let bottommostRow = Math.max(...rowMap);
    
    let rightOverflowCheck = rightmostCol + dimensionDifference;
    let bottomOverflowCheck = bottommostRow + dimensionDifference;

    // Right walls check

    let leftCascading = false;
    
    if( (rightOverflowCheck > (stateVar.noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
        stateVar.currentUserRefCellIndex -= rightOverflowCheck-(stateVar.noOfCols-1);
        leftCascading = true;
    }

    // Bottom walls check
    let upperCascading = false;
    
     if((bottomOverflowCheck > (stateVar.noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
        stateVar.currentUserRefCellIndex -= ((bottomOverflowCheck-(stateVar.noOfRows-1))*stateVar.noOfCols);
        upperCascading = true;
    }

    let checkWallInRotationMat = genFunc.rotateMatrixAntiClockwise(stateVar.currentlySelectedPieceMatrix);
    stateVar.currentlySelectedPieceMatrix = checkWallInRotationMat;

    updateCurrentUserArray();
    let bricksInTheWay = stateVar.currentUserArray.filter(index =>{
        return stateVar.cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert 
        stateVar.currentUserArray = prevUserArr;
        let checkWallInRotationMat = genFunc.rotateMatrixClockwise(stateVar.currentlySelectedPieceMatrix);
        stateVar.currentlySelectedPieceMatrix = checkWallInRotationMat;
        if(leftCascading == true){
            stateVar.currentUserRefCellIndex += rightOverflowCheck-(stateVar.noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            stateVar.currentUserRefCellIndex += ((bottomOverflowCheck-(stateVar.noOfRows-1))*stateVar.noOfCols);
            upperCascading = false;
        }

    };

    stateVar.currentUserArray.forEach(addFloatingBricks);
    stateVar.floorGuideArray.forEach(addFloorGuideBricks);
    
};

export function instaDrop() {

    let floorRow = stateEnquiry.findFloor();
    let refRow = Math.floor(stateVar.currentUserRefCellIndex/stateVar.noOfCols);
    let noOfRowsToShift = floorRow - refRow - 1;
    clearFloatingBricks();
    clearFloorGuideBricks();
    stateVar.currentUserRefCellIndex += (noOfRowsToShift*stateVar.noOfCols);
    updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addFlooredBricks);
    docElems.floorDropSound.currentTime = 0;
    docElems.floorDropSound.play();
    checkBrickedRows();
};

export function movePieceDown() {
    
    clearFloatingBricks();
    clearFloorGuideBricks();
    updateCurrentUserArray();
    if(!stateEnquiry.checkFloor() ){
        
        stateVar.currentUserRefCellIndex += stateVar.noOfCols;
        updateCurrentUserArray();
        stateVar.currentUserArray.forEach(addFloatingBricks);
        stateVar.floorGuideArray.forEach(addFloorGuideBricks);
        
    }else {
        stateVar.currentUserArray.forEach(addFlooredBricks);
        docElems.floorDropSound.currentTime = 0;
        docElems.floorDropSound.play();
        checkBrickedRows();   
    };
};

// #endregion logic for piece movement

export function unPauseGame(){
    if(!stateVar.gameOver && stateVar.paused){
        stateVar.paused = false;
        (!stateVar.pieceDownInterval) && (stateVar.pieceDownInterval = setInterval(movePieceDown, stateVar.gameSpeed));
    }
};

// #region piece generation logic

export async function generateUnblockedPiece(){

    if(stateVar.blockedPieces.length == stateVar.pieces.length){
        
        stateVar.gameOver = true;
        await docElems.mainLoopMusic.pause();
        if(stateVar.score >= stateVar.highscore){
            handleEndGame("newHighScore");
            await docElems.newHighScoreSound.play();
        } else{
            handleEndGame("gameOver");
            await docElems.gameOverSound.play();
        };
        clearInterval(stateVar.pieceDownInterval);
        stateVar.pieceDownInterval=null;
    } else {
        for (let piece of stateVar.pieces){
            if (!stateVar.blockedPieces.includes(piece)){
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
            };
        };
    };
};

export function getAvailableColumns(pieceMatrix){

    let pieceWidth = pieceMatrix[0].length;
    let depthMap = genFunc.getDepthMap(pieceMatrix);
    let pieceHeight1 = Math.max(...depthMap);
    let availableCols = [];

    // preliminary depth check for optimization
    let t1 = performance.now();
    let bricksInTheWayHeight1 = stateVar.cellsArr.filter(cell =>{
        return ((parseInt(cell.id) < (stateVar.noOfCols * pieceHeight1)) && (cell.classList.contains("flooredBrick")));
    });

    if (bricksInTheWayHeight1.length == 0){
        
        for (let i=0; i<(stateVar.noOfCols-pieceWidth+1); i++){
            availableCols.push(i)
        }   
        
    } else {

        for (let i=0; i<(stateVar.noOfCols-pieceWidth+1);i++){
            let pieceFitCheck = depthMap.map((pieceColDepth, pieceColIndex)=>{
                let brickInCol = stateEnquiry.checkBricksInColForDepth((i+pieceColIndex), pieceColDepth);
                return brickInCol.length>0 ? true:false;
            });
            if(!pieceFitCheck.includes(true)){
                availableCols.push(i)
            };
        };
    };
    return availableCols;
    
};

export function generateTetrisPiece(piecematrix, checknotation){

    resetCurrentArrays();
    
    // always generate the item from the top-left corner of the piece matrix grid

    let availableCols = getAvailableColumns(piecematrix);

    if (availableCols.length > 0){
        stateVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        stateVar.currentlySelectedPieceMatrix = piecematrix;
        updateCurrentUserArray();
        stateVar.currentUserArray.forEach(addFloatingBricks);
        stateVar.floorGuideArray.forEach(addFloorGuideBricks);
    } else {
       
        stateVar.blockedPieces.push(checknotation);
        generateUnblockedPiece();
    }

};

export function generateOPiece(){

    generateTetrisPiece(tetrisPieces.OPieceMatrix, "O");
};

export function generateIPiece(){

    generateTetrisPiece(tetrisPieces.IPieceMatrix, "I");
};

export function generateJPiece(){

    generateTetrisPiece(tetrisPieces.JPieceMatrix, "J");
};

export function generateLPiece(){

    generateTetrisPiece(tetrisPieces.LPieceMatrix, "L");
};

export function generateSPiece(){

    generateTetrisPiece(tetrisPieces.SPieceMatrix, "S");
};

export function generateZPiece() {

    generateTetrisPiece(tetrisPieces.ZPieceMatrix, "Z");
};

export function generateTPiece() {

    generateTetrisPiece(tetrisPieces.TPieceMatrix, "T");
};

export function selectNextPiece(){
    stateVar.nextPiece = stateVar.pieces[Math.floor(Math.random() * 7)];
    console.log("Next piece is: ", stateVar.nextPiece);
};

export function generateNextPiece(){
    switch(stateVar.nextPiece){
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
};


export function generateRandomPiece(){
    let randomSel = Math.floor(Math.random() * 7);
    
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
};

// #endregion piece generation logic

// #region game start functions

export function startGame() {
    
        stateVar.gameOver = false;
        stateVar.paused = false;
        docElems.mainLoopMusic.currentTime=0;
        docElems.mainLoopMusic.play();
        docElems.mainGridContainer.innerHTML = "";
        docElems.statusHeading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> <i class="bi bi-arrow-right-square"></i> <i class="bi bi-shift"></i> and Space / drag to play`;
        stateVar.boardSize = stateVar.noOfRows * stateVar.noOfCols;
        generateGridCells();
        resetCurrentArrays();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        stateVar.blockedPieces = [];
        stateVar.score = 0;
        docElems.scoreValue.innerHTML = stateVar.score;
        docElems.highScoreValue.innerHTML = stateVar.highscore;
        generateRandomPiece();
        selectNextPiece();
        console.log("nextPiece is: ", stateVar.nextPiece);
        stateVar.pieceDownInterval && clearInterval(stateVar.pieceDownInterval);
        stateVar.pieceDownInterval = setInterval(movePieceDown, stateVar.gameSpeed);
        
    
};

export function generateGridCells(){

    for (let i=0; i<stateVar.boardSize; i++){
        let newGridElement = document.createElement("div");
        newGridElement.classList.add("gridItem");
        newGridElement.id = i;
        docElems.mainGridContainer.appendChild(newGridElement);
    };

    docElems.mainGridContainer.style.gridTemplateColumns = `repeat(${stateVar.noOfCols}, 1fr)`;
    docElems.mainGridContainer.style.gridTemplateRows = `repeat(${stateVar.noOfRows}, 1fr)`;
    docElems.mainGridContainer.style.border= "transparent solid 5px";
    docElems.mainGridContainer.style.borderImage= `linear-gradient(to top, black, rgb(93, 45, 45))`;
    docElems.mainGridContainer.style.borderImageSlice= "1";

    let cellWidth = stateVar.boardWidth/stateVar.noOfCols;
    let boardHeight = stateVar.boardWidth+(cellWidth*(stateVar.noOfRows-stateVar.noOfCols));
    
    
    var docStyle = document.createElement("style");
    docStyle.textContent = `
        @media (max-width: 600px) {
            #mainGridContainer{
                width: ${stateVar.boardWidth/2}px;
                height: ${boardHeight/2}px;
            }
        }
        @media (min-width: 601px) {
            #mainGridContainer{
               width: ${stateVar.boardWidth}px;
                height: ${boardHeight}px;
            }

        }   

    `;

    document.head.appendChild(docStyle);
 
    stateVar.cellsArr = [...document.getElementsByClassName("gridItem")];
};

// #endregion game start functions

export function handleGamePause(){
    if(stateVar.isModalClosedBySubmit){
        stateVar.isModalClosedBySubmit = false;
    } else {
        docElems.mainLoopMusic.play();
        unPauseGame();
    }
};

export function handleUsersettings(e){
    'use strict'
    
    e.preventDefault();

    let valid=true;
    let checkCustomCol;
    let checkCustomRow;
    let checkCustomSpeed;
    
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
            stateVar.noOfCols = checkCustomCol;
        }

      
    } else{
        stateVar.noOfCols = parseInt(docElems.noOfColsSel.value);
     
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
            stateVar.noOfRows = checkCustomRow;
        }
      
    } 
    
    else{
        stateVar.noOfRows = parseInt(docElems.noOfRowsSel.value);
       
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
            stateVar.gameSpeed = checkCustomSpeed;
        }
        
    } else{
        stateVar.gameSpeed = parseInt(docElems.gameSpeedSel.value);
    };

     docElems.gameControlSel.value == "No" ? stateVar.swapSpaceBar = false : stateVar.swapSpaceBar = true;

    if (valid == false){
        return;
    }
    else {
        
        stateVar.isModalClosedBySubmit = true;
        docElems.modal.hide();
        startGame();
    }
};