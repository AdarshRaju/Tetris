// The module imported below contains the game's state variables
import stateVar from "../../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";

export function movePieceRightFunction(
  updateCurrentUserArray,
  clearFloatingBricks,
  clearFloorGuideBricks,
  addFloatingBricks,
  addFloorGuideBricks,
) {
  updateCurrentUserArray();

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
    clearFloatingBricks();
    clearFloorGuideBricks();
    stateVar.currentUserRefCellIndex += 1;
    updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addFloatingBricks);
    stateVar.floorGuideArray.forEach(addFloorGuideBricks);
  } else {
    // console.log("The piece has hit a right wall");
  }
}

export function movePieceLeftFunction(
  updateCurrentUserArray,
  clearFloatingBricks,
  clearFloorGuideBricks,
  addFloatingBricks,
  addFloorGuideBricks,
) {
  updateCurrentUserArray();
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
    clearFloatingBricks();
    clearFloorGuideBricks();

    stateVar.currentUserRefCellIndex -= 1;

    updateCurrentUserArray();

    stateVar.currentUserArray.forEach(addFloatingBricks);
    stateVar.floorGuideArray.forEach(addFloorGuideBricks);
  } else {
    // console.log("The piece has hit a left wall");
  }
}

export function movePieceDownFunction(
  updateCurrentUserArray,
  clearFloatingBricks,
  clearFloorGuideBricks,
  checkFloor,
  addFloatingBricks,
  addFloorGuideBricks,
  addFlooredBricks,
  brickHitBottomLogic,
) {
  clearFloatingBricks();
  clearFloorGuideBricks();
  updateCurrentUserArray();
  if (!checkFloor()) {
    stateVar.currentUserRefCellIndex += stateVar.noOfCols;
    updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addFloatingBricks);
    stateVar.floorGuideArray.forEach(addFloorGuideBricks);
  } else {
    stateVar.currentUserArray.forEach(addFlooredBricks);
    docElems.floorDropSound.currentTime = 0;
    docElems.floorDropSound.play();
    brickHitBottomLogic();
  }
}

export function instaDropFunction(
  updateCurrentUserArray,
  findFloor,
  clearFloatingBricks,
  clearFloorGuideBricks,
  addFlooredBricks,
) {
  const floorRow = findFloor();
  const refRow = Math.floor(
    stateVar.currentUserRefCellIndex / stateVar.noOfCols,
  );
  const noOfRowsToShift = floorRow - refRow - 1;
  clearFloatingBricks();
  clearFloorGuideBricks();
  stateVar.currentUserRefCellIndex += noOfRowsToShift * stateVar.noOfCols;
  updateCurrentUserArray();
  stateVar.currentUserArray.forEach(addFlooredBricks);
  docElems.floorDropSound.currentTime = 0;
  docElems.floorDropSound.play();
}
