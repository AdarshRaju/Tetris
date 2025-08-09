// The module imported below contains the game's state variables
import stateVar from "../../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains functions that perform calculations based on the state of the game
import * as stateEnquiry from "../stateEnquiry.js";
// The module imported below contains functions that add bricks
import * as addBricks from "./addBrickFunctions.js";
// The module imported below contains the game's major state change functions
import * as stateChange from "./generalStateChangeFunctions.js";
// The module imported below contains functions that clears bricks
import * as clearBricks from "./clearBrickFunctions.js";

export function movePieceRight() {
  stateChange.updateCurrentUserArray();

  // The right most column in all the elements from currentUserArray is used to check for right wall
  const colMap = stateVar.currentUserArray.map((index) => {
    return index % stateVar.noOfCols;
  });
  const rightmostCol = Math.max(...colMap);

  const flooredPiecesCheck = stateVar.currentUserArray.filter((index) => {
    if (stateVar.cellsArr[index + 1]) {
      return stateVar.cellsArr[index + 1].classList.contains("flooredBrick");
    }
    return false;
  });

  if (
    !(rightmostCol === stateVar.noOfCols - 1) &&
    !(flooredPiecesCheck.length > 0)
  ) {
    clearBricks.clearFloatingBricks();
    clearBricks.clearFloorGuideBricks();
    stateVar.currentUserRefCellIndex += 1;
    stateChange.updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
  } else {
    // console.log("The piece has hit a right wall");
  }
}

export function movePieceLeft() {
  stateChange.updateCurrentUserArray();
  // The left most column in all the elements from currentUserArray is used to check for left wall
  const colMap = stateVar.currentUserArray.map((index) => {
    return index % stateVar.noOfCols;
  });
  const leftmostCol = Math.min(...colMap);

  const flooredPiecesCheck = stateVar.currentUserArray.filter((index) => {
    if (stateVar.cellsArr[index - 1]) {
      return stateVar.cellsArr[index - 1].classList.contains("flooredBrick");
    }
    return false;
  });

  if (!(leftmostCol === 0) && !(flooredPiecesCheck.length > 0)) {
    clearBricks.clearFloatingBricks();
    clearBricks.clearFloorGuideBricks();

    stateVar.currentUserRefCellIndex -= 1;

    stateChange.updateCurrentUserArray();

    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
  } else {
    // console.log("The piece has hit a left wall");
  }
}

export function instaDrop() {
  const floorRow = stateEnquiry.findFloor();
  const refRow = Math.floor(
    stateVar.currentUserRefCellIndex / stateVar.noOfCols,
  );
  const noOfRowsToShift = floorRow - refRow - 1;
  clearBricks.clearFloatingBricks();
  clearBricks.clearFloorGuideBricks();
  stateVar.currentUserRefCellIndex += noOfRowsToShift * stateVar.noOfCols;
  stateChange.updateCurrentUserArray();
  stateVar.currentUserArray.forEach(addBricks.addFlooredBricks);
  docElems.floorDropSound.currentTime = 0;
  docElems.floorDropSound.play();
  stateChange.brickHitBottomLogic();
}

export function movePieceDown() {
  clearBricks.clearFloatingBricks();
  clearBricks.clearFloorGuideBricks();
  stateChange.updateCurrentUserArray();
  if (!stateEnquiry.checkFloor()) {
    stateVar.currentUserRefCellIndex += stateVar.noOfCols;
    stateChange.updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
  } else {
    stateVar.currentUserArray.forEach(addBricks.addFlooredBricks);
    docElems.floorDropSound.currentTime = 0;
    docElems.floorDropSound.play();
    stateChange.brickHitBottomLogic();
  }
}

export function shiftBricks(fullRowsArr) {
  if (fullRowsArr.length > 0) {
    // Sorting array numerically in ascending order (top of grid to bottom)
    fullRowsArr.sort((a, b) => {
      return a - b;
    });
    const brickedCells = [...document.getElementsByClassName("flooredBrick")];
    const newIndicesToAdd = [];
    brickedCells.forEach((cell) => {
      const cellIndex = parseInt(cell.id, 10);
      const cellRow = Math.floor(cellIndex / stateVar.noOfCols);

      const shiftBy = fullRowsArr.filter((fullRow) => fullRow > cellRow).length;
      if (shiftBy > 0) {
        cell.classList.remove("flooredBrick");
        const newIndex = cellIndex + shiftBy * stateVar.noOfCols;
        newIndicesToAdd.push(newIndex);
      }
    });
    newIndicesToAdd.forEach((index) => {
      stateVar.cellsArr[index].classList.add("flooredBrick");
    });
  }
}
