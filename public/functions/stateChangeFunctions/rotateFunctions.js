// The module imported below contains the game's state variables
import {stateVar} from "../../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../generalFunctions.js";
// The module imported below contains functions that add bricks
import * as addBricks from "./addBrickFunctions.js";
// The module imported below contains functions that clears bricks
import * as clearBricks from "./clearBrickFunctions.js";
// The module imported below contains the game's major state change functions
import * as stateChange from "./generalStateChangeFunctions.js";

export function rotatePieceClockwise(){

    // sound effect
    docElems.pieceRotate.currentTime = 0;
    docElems.pieceRotate.play();

    clearBricks.clearFloatingBricks();
    clearBricks.clearFloorGuideBricks();
    stateChange.updateCurrentUserArray();
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

    stateChange.updateCurrentUserArray();
    let bricksInTheWay = stateVar.currentUserArray.filter(index =>{
        return stateVar.cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert rotation if there are bricks in the way of the final location
        stateVar.currentUserArray = prevUserArr;
        let revertRotationMat = genFunc.rotateMatrixAntiClockwise(stateVar.currentlySelectedPieceMatrix);
        stateVar.currentlySelectedPieceMatrix = revertRotationMat;
        if(leftCascading == true){
            stateVar.currentUserRefCellIndex += rightOverflowCheck-(stateVar.noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            stateVar.currentUserRefCellIndex += ((bottomOverflowCheck-(stateVar.noOfRows-1))*stateVar.noOfCols);
            upperCascading = false;
        }

    }

    
    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
};

export function rotatePieceAntiClockwise(){

    docElems.pieceRotate.currentTime = 0;
    docElems.pieceRotate.play();
    clearBricks.clearFloatingBricks();
    clearBricks.clearFloorGuideBricks();
    stateChange.updateCurrentUserArray();
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

    stateChange.updateCurrentUserArray();
    let bricksInTheWay = stateVar.currentUserArray.filter(index =>{
        return stateVar.cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert rotation if there are bricks in the way of the final location
        stateVar.currentUserArray = prevUserArr;
        let revertRotationMat = genFunc.rotateMatrixClockwise(stateVar.currentlySelectedPieceMatrix);
        stateVar.currentlySelectedPieceMatrix = revertRotationMat;
        if(leftCascading == true){
            stateVar.currentUserRefCellIndex += rightOverflowCheck-(stateVar.noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            stateVar.currentUserRefCellIndex += ((bottomOverflowCheck-(stateVar.noOfRows-1))*stateVar.noOfCols);
            upperCascading = false;
        }

    };

    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
    
};