// This module contains functions that alters the game's state variables

// The module imported below contains the 2D Array logic of the matrix pieces
import * as tetrisPieces from "../../globalVariables/tetrisPieces.js";
// The module imported below contains the game's state variables
import {stateVar} from "../../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../generalFunctions.js";
// The module imported below contains functions that perform calculations based on the state of the game
import * as stateEnquiry from "../stateEnquiry.js";
// The module imported below contains functions that add bricks
import * as addBricks from "./addBrickFunctions.js";
// The module imported below contains functions that clears bricks
import * as clearBricks from "./clearBrickFunctions.js";
// The module imported below contains functions that move bricks linarly
import * as moveBricks from "./movePieceFunctions.js";
// The module imported below contains functions that rotate bricks
import * as rotateBricks from "./rotateFunctions.js";

// The valid values from the user are temporarily stored in case the user triggers a board height warning and goes back to the old game
let validColSize;
let validRowSize;
let validSpeed;
let validSwap;
let validLocal;

export function pauseGame(){
    if(!stateVar.paused && !stateVar.gameOver){

        stateVar.paused = true;
        clearInterval(stateVar.pieceDownInterval);
        stateVar.pieceDownInterval = null;
    }
};

export function resetCurrentArrays(){
    
    clearBricks.clearFloatingBricks();
    clearBricks.clearFloorGuideBricks();
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
            moveBricks.movePieceLeft();
        }

        if(e.key == "ArrowRight"){
            moveBricks.movePieceRight();
        }

        if(e.key == "ArrowDown"){
            moveBricks.movePieceDown();
        }

        if(e.key == " ") {
            !stateVar.swapSpaceBar ? moveBricks.instaDrop() : rotateBricks.rotatePieceClockwise();
            
        }

        if(e.key == "ArrowUp") {
            stateVar.swapSpaceBar ? moveBricks.instaDrop() : rotateBricks.rotatePieceClockwise();
        }

        if(e.key == "Shift") {
            rotateBricks.rotatePieceAntiClockwise();
        }
    }
};

function handleEndGame(classListToAdd){

    document.body.classList.add(classListToAdd);
    
    if(classListToAdd =="newHighScore"){
        docElems.statusHeading.innerHTML = "Congrats! New High Score! Press start to play again";
    } else {
        docElems.statusHeading.innerHTML = "Game Over! Press start to play again";
    }
    setTimeout(()=> document.body.classList.remove(classListToAdd), 200);
};

function nextPieceLogic(){
    resetCurrentArrays();
    addBricks.generateNextPiece();
    addBricks.selectNextPiece();
    addBricks.updateNextPieceIndicator();
};

export function fillSevenBag(){
    let copyarr = [...stateVar.pieces];
    stateVar.sevenBag = genFunc.shuffleArray(copyarr);
}

export async function brickHitBottomLogic(){

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
        if (fullRowsArr.length >0){
            pauseGame();
            setTimeout(() => {
                
                clearBricks.clearFullRows(fullRowsArr);
                // The floored bricks would still be floating in place b/w the rows which are just cleared needs to shift down
                moveBricks.shiftBricks(fullRowsArr);
                nextPieceLogic();
                unPauseGame();  
            },200);  
            
        } else{
            nextPieceLogic();
        }; 
    }
};

export function buttonClickValidation(movefunction){
    if(!stateVar.gameOver && !stateVar.paused){
        return movefunction();
    }
};

export function unPauseGame(){
    if(!stateVar.gameOver && stateVar.paused){
        stateVar.paused = false;
        (!stateVar.pieceDownInterval) && (stateVar.pieceDownInterval = setInterval(moveBricks.movePieceDown, stateVar.gameSpeed));
    }
};

export function startGame() {
    
        stateVar.gameOver = false;
        stateVar.paused = false;
        docElems.mainLoopMusic.currentTime=0;
        docElems.mainLoopMusic.play();
        docElems.mainGridContainer.innerHTML = "";
        docElems.nextPieceContainer1.innerHTML = "";
        docElems.statusHeading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> <i class="bi bi-arrow-right-square"></i> <i class="bi bi-shift"></i> and Space / drag to play`;
        stateVar.boardSize = stateVar.noOfRows * stateVar.noOfCols;
        addBricks.generateGridCells();
        resetCurrentArrays();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        stateVar.blockedPieces = [];
        stateVar.score = 0;
        docElems.scoreValue.innerHTML = stateVar.score;
        docElems.highScoreValue.innerHTML = stateVar.highscore;
        addBricks.generateFirstPiece();
        addBricks.selectNextPiece();
        addBricks.updateNextPieceIndicator();
        stateVar.pieceDownInterval && clearInterval(stateVar.pieceDownInterval);
        stateVar.pieceDownInterval = setInterval(moveBricks.movePieceDown, stateVar.gameSpeed);
        
    
};

export function handleGameUnPause(){
    if(!stateVar.gameOver && !docElems.boardHeightWarningModalDOM.classList.contains("show")){
            docElems.mainLoopMusic.play();
            unPauseGame();
    }
};

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
    updateCurrentFloorGuideArray();
    
};

function updateCurrentFloorGuideArray(){

    stateVar.floorGuideArray = [];
    let highestRow = stateEnquiry.findFloor();
    let refIndRow = Math.floor(stateVar.currentUserRefCellIndex/stateVar.noOfCols);
    let noOfRowsToShift = highestRow - refIndRow - 1;

    stateVar.floorGuideArray = stateVar.currentUserArray.map(index =>{
        return (index+(noOfRowsToShift*stateVar.noOfCols));
    })
    
};

export function handleUsersettings(e){
    'use strict'
    
    e.preventDefault();

    let checkCustomCol;
    let checkCustomRow;
    let checkCustomSpeed;

    validLocal = true;
    docElems.customColInvalidFeedback.classList.remove("invalid-feedback");
    docElems.customRowInvalidFeedback.classList.remove("invalid-feedback");
    docElems.customSpeedInvalidFeedback.classList.remove("invalid-feedback");

    if(docElems.noOfColsSel.value == "custom"){
        checkCustomCol = parseInt(docElems.customColsSel.value);
        if(!docElems.customColsSel.value || checkCustomCol <5 || checkCustomCol >50){
            
            validLocal = false;

            docElems.customColsSel.classList.add("is-invalid");
            docElems.customColInvalidFeedback.classList.add("invalid-feedback");
            docElems.customColInvalidFeedback.hidden = false;
        } else {
            docElems.customColsSel.classList.add("is-valid");
            docElems.customColInvalidFeedback.classList.remove("invalid-feedback");
            docElems.customColInvalidFeedback.hidden = true;
           
            validColSize = checkCustomCol;

        }

      
    } else{
        
        validColSize = parseInt(docElems.noOfColsSel.value);
     
    };

    if (docElems.noOfRowsSel.value  == "custom"){
        checkCustomRow = parseInt(docElems.customRowsSel.value);
        if(!docElems.customRowsSel.value || checkCustomRow <10 || checkCustomRow >100){
           
            validLocal = false;

            docElems.customRowsSel.classList.add("is-invalid");
            docElems.customRowInvalidFeedback.classList.add("invalid-feedback");
            docElems.customRowInvalidFeedback.hidden = false;
        } else {
            docElems.customRowsSel.classList.add("is-valid");
            docElems.customRowInvalidFeedback.classList.remove("invalid-feedback");
            docElems.customRowInvalidFeedback.hidden = true;
           
            validRowSize = checkCustomRow;
        }
      
    } 
    
    else{
        
        validRowSize = parseInt(docElems.noOfRowsSel.value);
    };

    if (docElems.gameSpeedSel.value  == "custom"){
        checkCustomSpeed = parseInt(docElems.customSpeedSel.value);
        if(!docElems.customSpeedSel.value || checkCustomSpeed <25 || checkCustomSpeed >5000){
           
            validLocal = false;
            docElems.customSpeedSel.classList.add("is-invalid");
            docElems.customSpeedInvalidFeedback.classList.add("invalid-feedback");
            docElems.customSpeedInvalidFeedback.hidden = false;
        } else {
            docElems.customSpeedSel.classList.add("is-valid");
            docElems.customSpeedInvalidFeedback.classList.remove("invalid-feedback");
            docElems.customSpeedInvalidFeedback.hidden = true;
         
            validSpeed = checkCustomSpeed;
        }
        
    } else{
      
        validSpeed = parseInt(docElems.gameSpeedSel.value);
    };

    
    docElems.gameControlSel.value == "No" ? validSwap = false : validSwap = true;
   
    if (validLocal == false){
        return;
    }
    else {
        stateVar.validSettings = true;
        // A board check can be added here to automatically change the user's selection to have board size not exceeding vh
       
        let cellWidth = stateVar.boardWidth/validColSize;
       
        let boardHeight = stateVar.boardWidth+(cellWidth*(validRowSize-validColSize));
        // checks if the board height exceeds the whole window height
        let boardHeightCheck = genFunc.checkBoardHeight(boardHeight);
        if (boardHeightCheck){
            docElems.boardHeightWarningModal.show();
            docElems.startGameModal.hide();
        } else{
            setBoardDimensions(validColSize, validRowSize, validSpeed, validSwap);
            docElems.startGameModal.hide();
            startGame();
        }  
    };
};


function setBoardDimensions(cols, rows, speed, swap){
    
    stateVar.noOfCols = cols;
    stateVar.noOfRows = rows;
    stateVar.gameSpeed= speed;
    stateVar.swapSpaceBar = swap;
};


export function handleSettingsConfirm(e){
    if (stateVar.validSettings){
        
        setBoardDimensions(validColSize, validRowSize, validSpeed, validSwap);
        docElems.boardHeightWarningModal.hide();
        startGame();
    }

};