// The module imported below contains the game's state variables
import {stateVar} from "../../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains functions that perform calculations based on the state of the game
import * as stateEnquiry from "../stateEnquiry.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../generalFunctions.js";
// The module imported below contains the 2D Array logic of the matrix pieces
import * as tetrisPieces from "../../globalVariables/tetrisPieces.js";
// The module imported below contains the game's major state change functions
import * as stateChange from "./generalStateChangeFunctions.js";

export function addFloatingBricks(indexno) {
    stateVar.cellsArr[indexno].classList.add("floatingBrick");
};

export function addFlooredBricks(indexno) {
    stateVar.cellsArr[indexno].classList.add("flooredBrick");
};

export function addFloorGuideBricks(indexno) {
    stateVar.cellsArr[indexno].classList.add("floorCheckBrick");
};

export async function generateUnblockedPiece(){
    console.log("generate unblocked piece was activated");

    if(stateVar.blockedPieces.length == stateVar.pieces.length){
        
        stateVar.gameOver = true;
        await docElems.mainLoopMusic.pause();
        if(stateVar.score >= stateVar.highScore){
            stateChange.handleEndGame("newHighScore");
            await docElems.newHighScoreSound.play();
        } else{
            stateChange.handleEndGame("gameOver");
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

export function generateGridCells(){

    for (let i=0; i<stateVar.boardSize; i++){
        let newGridElement = document.createElement("div");
        newGridElement.classList.add("gridItem");
        newGridElement.id = i;
        docElems.mainGridContainer.appendChild(newGridElement);
    };

    let cellWidth = stateVar.boardWidth/stateVar.noOfCols;
    let boardHeight = stateVar.boardWidth+(cellWidth*(stateVar.noOfRows-stateVar.noOfCols));
    let boardHeightCheck = genFunc.checkBoardHeight();
    
    var docStyle = document.createElement("style");
    docStyle.textContent = `
        #mainGridContainer {
            grid-template: repeat(${stateVar.noOfRows}, 1fr) / repeat(${stateVar.noOfCols}, 1fr) ;
            border: transparent solid 5px;
            border-image: linear-gradient(to top, black, rgb(93, 45, 45));
            border-image-slice: 1;
        }
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

export function updateNextPieceIndicator(){
    // This logic is inclusive of accepting custom tetris pieces of different dimensions introduced in the future
    docElems.nextPieceContainer1.innerHTML = "";
    let maxDimension = stateVar.nextPieceMatrix.length > stateVar.nextPieceMatrix[0].length ? stateVar.nextPieceMatrix.length : stateVar.nextPieceMatrix[0].length;
    let pieceMatrixWidth = stateVar.nextPieceMatrix[0].length;
    let pieceMatrixHeight = stateVar.nextPieceMatrix.length;
    let localNoOfCols = pieceMatrixWidth == maxDimension ? pieceMatrixWidth : pieceMatrixHeight;
    let flatarray = stateVar.nextPieceMatrix.flat();
    // The next piece indicator container will always be a square shape
    let pieceIndicatorSize = maxDimension * maxDimension;

    // When the pieceMatrixWidth is the maxDimension, we can just add the cells in order from the piece matrix
    if (pieceMatrixWidth == maxDimension){
        for (let i=0; i<pieceIndicatorSize; i++){
            let newGridElement = document.createElement("div");
            if (i<(flatarray.length) ){          
                if(flatarray[i]){
                    newGridElement.classList.add("nextBrick");
                } else {
                    newGridElement.classList.add("nextPieceGridItem");
                }
            }else{
                newGridElement.classList.add("nextPieceGridItem");
            };
            docElems.nextPieceContainer1.appendChild(newGridElement);
        };
    } else {
        let localCounter =0;
        for (let i=0; i<pieceIndicatorSize; i++){
            let newGridElement = document.createElement("div");
                // In this case, the piece height will be the maxDimension
                        
            if (i%maxDimension<pieceMatrixWidth){
                if(flatarray[localCounter]){
                    newGridElement.classList.add("nextBrick");
                } else {
                    newGridElement.classList.add("nextPieceGridItem");
                }
                localCounter++;
            }else {
                newGridElement.classList.add("nextPieceGridItem");
            }
            docElems.nextPieceContainer1.appendChild(newGridElement);
        };

    };
    
    var docStyle = document.createElement("style");
    docStyle.textContent = `
    
        #nextPieceContainer1 {
            grid-template: repeat(${maxDimension}, 1fr) / repeat(${maxDimension}, 1fr);
            border: transparent solid 3px;
            border-image: linear-gradient(to top, black, rgb(93, 45, 45));
            border-image-slice: 1;
        }
        @media (max-width: 600px) {
            #nextPieceContainer1, #nextPieceContainer2{
                width: ${stateVar.nextPieceIndicatorWidth/2}px;
                height: ${stateVar.nextPieceIndicatorWidth/2}px;
                margin-bottom: 5px;
            }
        }
        @media (min-width: 601px) {
            #nextPieceContainer1, #nextPieceContainer2{
               width: ${stateVar.nextPieceIndicatorWidth}px;
                height: ${stateVar.nextPieceIndicatorWidth}px;
                margin-bottom: 10px;
            }

        }   

    `;
    document.head.appendChild(docStyle);
};


function generateTetrisPiece(pieceMatrix, checknotation){

    stateChange.resetCurrentArrays();

    let trimmedMatrix = genFunc.trimAllMatrixSides(pieceMatrix);
    
    // always generate the item from the top-left corner of the piece matrix grid

    let availableCols = stateEnquiry.getAvailableColumns(trimmedMatrix);

    if (availableCols.length > 0){
        stateVar.currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        stateVar.currentlySelectedPieceMatrix = trimmedMatrix;
        stateChange.updateCurrentUserArray();
        stateVar.currentUserArray.forEach(addFloatingBricks);
        stateVar.floorGuideArray.forEach(addFloorGuideBricks);
    } else {
       
        stateVar.blockedPieces.push(checknotation);
        generateUnblockedPiece();
    }

};

function generateOPiece(){

    generateTetrisPiece(tetrisPieces.OPieceMatrix, "O");
};

function generateIPiece(){

    generateTetrisPiece(tetrisPieces.IPieceMatrix, "I");
};

function generateJPiece(){

    generateTetrisPiece(tetrisPieces.JPieceMatrix, "J");
};

function generateLPiece(){

    generateTetrisPiece(tetrisPieces.LPieceMatrix, "L");
};

function generateSPiece(){

    generateTetrisPiece(tetrisPieces.SPieceMatrix, "S");
};

function generateZPiece() {

    generateTetrisPiece(tetrisPieces.ZPieceMatrix, "Z");
};

function generateTPiece() {

    generateTetrisPiece(tetrisPieces.TPieceMatrix, "T");
};

export function selectNextPiece(){
    
    if (stateVar.sevenBag.length==0){
        stateChange.fillSevenBag();
    }

    let nextPieceIndex = Math.floor(Math.random() * (stateVar.sevenBag.length));
    let nextPiece = stateVar.sevenBag[nextPieceIndex];
    stateVar.sevenBag.splice(nextPieceIndex,1);


    switch(nextPiece){
        case "O":
        stateVar.nextPieceMatrix= tetrisPieces.OPieceMatrix;
        break;

        case "I":
        stateVar.nextPieceMatrix= tetrisPieces.IPieceMatrix;
        break;

        case "J":
        stateVar.nextPieceMatrix= tetrisPieces.JPieceMatrix;
        break;

        case "L":
        stateVar.nextPieceMatrix= tetrisPieces.LPieceMatrix;
        break;

        case "S":
        stateVar.nextPieceMatrix= tetrisPieces.SPieceMatrix;
        break;

        case "Z":
        stateVar.nextPieceMatrix= tetrisPieces.ZPieceMatrix;
        break;

        case "T":
        stateVar.nextPieceMatrix= tetrisPieces.TPieceMatrix;
        break;
    }
};

export function generateNextPiece(){
   
    switch(stateVar.nextPieceMatrix){

        case tetrisPieces.OPieceMatrix:
        generateOPiece();
        break;

        case tetrisPieces.IPieceMatrix:
        generateIPiece();
        break;

        case tetrisPieces.JPieceMatrix:
        generateJPiece();
        break;

        case tetrisPieces.LPieceMatrix:
        generateLPiece();
        break;

        case tetrisPieces.SPieceMatrix:
        generateSPiece();
        break;

        case tetrisPieces.ZPieceMatrix:
        generateZPiece();
        break;

        case tetrisPieces.TPieceMatrix:
        generateTPiece();
        break;
    }
};


export function generateFirstPiece(){
    
    // Instead of generating a random piece, the seven piece system is implemented to provide a better user experience
    if (stateVar.sevenBag.length==0){
        stateChange.fillSevenBag();
    }

    let randomSelIndex = Math.floor(Math.random() * (stateVar.sevenBag.length));
    let randomSel = stateVar.sevenBag[randomSelIndex];
    stateVar.sevenBag.splice(randomSelIndex,1);
    
    switch(randomSel){
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