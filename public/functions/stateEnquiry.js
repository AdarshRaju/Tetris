// This module contains functions that do calculations based on the game state, but doesn't modify the game state.
// The functions are generally arranged from least dependent to most dependent

// The module imported below contain the game's state variables
import {stateVar} from "../globalVariables/stateVars.js";


export function checkBricksInColForDepth(colNo,depth){
    let bricksInCol = stateVar.cellsArr.filter(cell=>{
        return (parseInt(cell.id) < (stateVar.noOfCols * depth)) && (cell.classList.contains("flooredBrick"))
        && (parseInt(cell.id)%stateVar.noOfCols == colNo)
    })

    return bricksInCol;
};

export function checkFloor(){
    
    
    let floorHitCells = stateVar.currentUserArray.filter(cell =>{
       return ((cell + stateVar.noOfCols) >= stateVar.boardSize) || (stateVar.cellsArr[cell + stateVar.noOfCols].classList.contains("flooredBrick"))       
    });
    return floorHitCells.length >0 ? true : false;
};

export function findFloor(){
    
    let relevantCellsIndex = [];
  

    // If there is a 'gap' in between two indices vertically, it is relevant
    stateVar.currentUserArray.forEach(index =>{
        if (!stateVar.currentUserArray.includes((parseInt(index)+stateVar.noOfCols))){
            relevantCellsIndex.push(index);
        }
    })

    let refIndRow = Math.floor(stateVar.currentUserRefCellIndex/stateVar.noOfCols);

    let floorMap = relevantCellsIndex.map(releIndex=>{
        let highestFloorRow;
        let releIndexRow = Math.floor(releIndex/stateVar.noOfCols);
        let extraDepth = releIndexRow - refIndRow;
        let brickCheck = stateVar.cellsArr.filter(cell =>{
            return((parseInt(cell.id) % stateVar.noOfCols == releIndex % stateVar.noOfCols) && 
            (parseInt(cell.id) > releIndex) && (cell.classList.contains("flooredBrick")))
        })
        if(brickCheck.length>0){
            let brickRowMap = brickCheck.map(brickInWay =>{
                return Math.floor(parseInt(brickInWay.id)/stateVar.noOfCols);
            });
            highestFloorRow = Math.min(...brickRowMap);
        } else {
            highestFloorRow = stateVar.noOfRows;
        }
        // The result is shifted to be as if being just below the refIndRow
        return (highestFloorRow-extraDepth);
    })
    return Math.min(...floorMap);
    
};

export function getRowsOfBricked(){
    let rowsOfBricked = [];
    let brickedCells = [...document.getElementsByClassName("flooredBrick")];
    brickedCells.forEach(cell =>{
        // rowsOfBricked collects the row numbers of all the bricked cells
        rowsOfBricked.push(Math.floor(parseInt(cell.id)/stateVar.noOfCols));
    });
    return rowsOfBricked;
};

export function getFullRowsArray(rowsOfBricked){
    // uniqueRowsArr stores the unique rows with atleast one bricked cell
    let uniqueRowsArr = [...new Set(rowsOfBricked)];
    // fullRowsArr stores the unique rows with all cells bricked in it
    let fullRowsArr = [];

    uniqueRowsArr.forEach(uniqueRowNumber =>{
   
        let countArr = rowsOfBricked.filter(row =>{
            return (row == uniqueRowNumber);
        });
        if (countArr.length == stateVar.noOfCols){
            fullRowsArr.push(uniqueRowNumber);
        }
    });

    return fullRowsArr;
};