// This module contains functions that do calculations based on the game state and sometimes modify the game state.
// The functions are generally arranged from least dependent to most dependent

// The module imported below contain the game's state variables
import stateVar from "../globalVariables/stateVars.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "./generalFunctions.js";

export function checkBricksInColForDepth(colNo, depth) {
  const bricksInCol = stateVar.cellsArr.filter((cell) => {
    return (
      parseInt(cell.id, 10) < stateVar.noOfCols * depth &&
      cell.classList.contains("flooredBrick") &&
      parseInt(cell.id, 10) % stateVar.noOfCols === colNo
    );
  });

  return bricksInCol;
}

export function checkFloor() {
  const floorHitCells = stateVar.currentUserArray.filter((cell) => {
    return (
      cell + stateVar.noOfCols >= stateVar.boardSize ||
      stateVar.cellsArr[cell + stateVar.noOfCols].classList.contains(
        "flooredBrick",
      )
    );
  });
  if (floorHitCells.length > 0) {
    return true;
  }
  return false;
}

export function findFloor() {
  const relevantCellsIndex = [];

  // If there is a 'gap' in between two indices vertically, it is relevant
  stateVar.currentUserArray.forEach((index) => {
    if (
      !stateVar.currentUserArray.includes(
        parseInt(index, 10) + stateVar.noOfCols,
      )
    ) {
      relevantCellsIndex.push(index);
    }
  });

  const refIndRow = Math.floor(
    stateVar.currentUserRefCellIndex / stateVar.noOfCols,
  );

  const floorMap = relevantCellsIndex.map((releIndex) => {
    let highestFloorRow;
    const releIndexRow = Math.floor(releIndex / stateVar.noOfCols);
    const extraDepth = releIndexRow - refIndRow;
    const brickCheck = stateVar.cellsArr.filter((cell) => {
      return (
        parseInt(cell.id, 10) % stateVar.noOfCols ===
          releIndex % stateVar.noOfCols &&
        parseInt(cell.id, 10) > releIndex &&
        cell.classList.contains("flooredBrick")
      );
    });
    if (brickCheck.length > 0) {
      const brickRowMap = brickCheck.map((brickInWay) => {
        return Math.floor(parseInt(brickInWay.id, 10) / stateVar.noOfCols);
      });
      highestFloorRow = Math.min(...brickRowMap);
    } else {
      highestFloorRow = stateVar.noOfRows;
    }
    // The result is shifted to be as if being just below the refIndRow
    return highestFloorRow - extraDepth;
  });
  return Math.min(...floorMap);
}

export function getRowsOfBricked() {
  const rowsOfBricked = [];
  const brickedCells = [...document.getElementsByClassName("flooredBrick")];
  brickedCells.forEach((cell) => {
    // rowsOfBricked collects the row numbers of all the bricked cells
    rowsOfBricked.push(Math.floor(parseInt(cell.id, 10) / stateVar.noOfCols));
  });
  return rowsOfBricked;
}

export function getFullRowsArray(rowsOfBricked) {
  // uniqueRowsArr stores the unique rows with atleast one bricked cell
  const uniqueRowsArr = [...new Set(rowsOfBricked)];
  // fullRowsArr stores the unique rows with all cells bricked in it
  const fullRowsArr = [];

  uniqueRowsArr.forEach((uniqueRowNumber) => {
    const countArr = rowsOfBricked.filter((row) => {
      return row === uniqueRowNumber;
    });
    if (countArr.length === stateVar.noOfCols) {
      fullRowsArr.push(uniqueRowNumber);
    }
  });

  return fullRowsArr;
}

export function getAvailableColumns(pieceMatrix) {
  const pieceWidth = pieceMatrix[0].length;
  const depthMap = genFunc.getDepthMap(pieceMatrix);
  const pieceHeight1 = Math.max(...depthMap);
  const availableCols = [];

  // preliminary depth check for optimization

  const bricksInTheWayHeight1 = stateVar.cellsArr.filter((cell) => {
    return (
      parseInt(cell.id, 10) < stateVar.noOfCols * pieceHeight1 &&
      cell.classList.contains("flooredBrick")
    );
  });

  if (bricksInTheWayHeight1.length === 0) {
    for (let i = 0; i < stateVar.noOfCols - pieceWidth + 1; i += 1) {
      availableCols.push(i);
    }
  } else {
    for (let i = 0; i < stateVar.noOfCols - pieceWidth + 1; i += 1) {
      const pieceFitCheck = depthMap.map((pieceColDepth, pieceColIndex) => {
        const brickInCol = checkBricksInColForDepth(
          i + pieceColIndex,
          pieceColDepth,
        );
        if (brickInCol.length > 0) {
          return true;
        }
        return false;
      });
      if (!pieceFitCheck.includes(true)) {
        availableCols.push(i);
      }
    }
  }
  return availableCols;
}
