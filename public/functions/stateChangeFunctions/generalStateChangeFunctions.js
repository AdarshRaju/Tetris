// This module contains functions that alters the game's state variables

// The module imported below contains the various tetris pieces used in the game
import * as tetrisPieces from "../../globalVariables/tetrisPieces.js";
// The module imported below contains the game's state variables
import stateVar from "../../globalVariables/stateVars.js";
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

// The valid values from the user are temporarily stored in case the user triggers a board height warning and goes back to the old game
let validColSize;
let validRowSize;
let validSpeed;
let validSwap;
let validLocal;

export function pauseGame() {
  if (!stateVar.paused && !stateVar.gameOver) {
    stateVar.paused = true;
    clearInterval(stateVar.pieceDownInterval);
    stateVar.pieceDownInterval = null;
  }
}

export function resetCurrentArrays() {
  clearBricks.clearFloatingBricks();
  clearBricks.clearFloorGuideBricks();
  stateVar.currentUserRefCellIndex = 0;
  stateVar.currentUserArray = [];
  stateVar.floorGuideArray = [];
  stateVar.currentlySelectedPieceMatrix = [];
}

function handleEndGame(classListToAdd) {
  document.body.classList.add(classListToAdd);

  if (classListToAdd === "newHighScore") {
    docElems.statusHeading.innerHTML =
      "Congrats! New High Score! Press start to play again";
  } else {
    docElems.statusHeading.innerHTML = "Game Over! Press start to play again";
  }
  setTimeout(() => document.body.classList.remove(classListToAdd), 200);
}

export function fillSevenBag() {
  const copyarr = [...stateVar.pieces];
  stateVar.sevenBag = genFunc.shuffleArray(copyarr);
}

export function buttonClickValidation(movefunction) {
  if (!stateVar.gameOver && !stateVar.paused) {
    return movefunction();
  }
  return null;
}

function updateCurrentFloorGuideArray() {
  stateVar.floorGuideArray = [];
  const highestRow = stateEnquiry.findFloor();
  const refIndRow = Math.floor(
    stateVar.currentUserRefCellIndex / stateVar.noOfCols,
  );
  const noOfRowsToShift = highestRow - refIndRow - 1;

  stateVar.floorGuideArray = stateVar.currentUserArray.map((index) => {
    return index + noOfRowsToShift * stateVar.noOfCols;
  });
}

export function updateCurrentUserArray() {
  stateVar.currentUserArray = [];

  //  The stateVar.currentUserRefCellIndex is the starting index of the topmost cell in the matrix
  stateVar.currentlySelectedPieceMatrix.forEach((row, rowAdd) => {
    // For toprow, we need to add +1 for each subsequent item from the stateVar.currentUserRefCellIndex
    row.forEach((cell, colIndex) => {
      // only if the piece matrix's entry value is "True" is a value added to stateVar.currentUserArray
      if (cell) {
        stateVar.currentUserArray.push(
          stateVar.currentUserRefCellIndex +
            rowAdd * stateVar.noOfCols +
            colIndex,
        );
      }
    });
  });
  updateCurrentFloorGuideArray();
}

function setBoardDimensions(cols, rows, speed, swap) {
  stateVar.noOfCols = cols;
  stateVar.noOfRows = rows;
  stateVar.gameSpeed = speed;
  stateVar.swapSpaceBar = swap;
  // Also set the high score from the local storage if it exists
  const highScoreCheck = genFunc.checkHighScore(cols, rows, speed);
  const [scoreCheckValue] = highScoreCheck;
  if (scoreCheckValue) {
    const [, , , prevHighScore] = scoreCheckValue;
    stateVar.highScore = prevHighScore;
  } else {
    stateVar.highScore = 0;
  }
  docElems.highScoreValue.innerHTML = stateVar.highScore;
}

export function selectNextPiece() {
  if (stateVar.sevenBag.length === 0) {
    fillSevenBag();
  }

  const nextPieceIndex = Math.floor(Math.random() * stateVar.sevenBag.length);
  const nextPiece = stateVar.sevenBag[nextPieceIndex];
  stateVar.sevenBag.splice(nextPieceIndex, 1);

  switch (nextPiece) {
    case "O":
      stateVar.nextPieceMatrix = tetrisPieces.OPieceMatrix;
      break;

    case "I":
      stateVar.nextPieceMatrix = tetrisPieces.IPieceMatrix;
      break;

    case "J":
      stateVar.nextPieceMatrix = tetrisPieces.JPieceMatrix;
      break;

    case "L":
      stateVar.nextPieceMatrix = tetrisPieces.LPieceMatrix;
      break;

    case "S":
      stateVar.nextPieceMatrix = tetrisPieces.SPieceMatrix;
      break;

    case "Z":
      stateVar.nextPieceMatrix = tetrisPieces.ZPieceMatrix;
      break;

    case "T":
      stateVar.nextPieceMatrix = tetrisPieces.TPieceMatrix;
      break;
    default:
  }
}

function generateTetrisPiece(pieceMatrix, checknotation) {
  resetCurrentArrays();

  const trimmedMatrix = genFunc.trimAllMatrixSides(pieceMatrix);

  // always generate the item from the top-left corner of the piece matrix grid

  const availableCols = stateEnquiry.getAvailableColumns(trimmedMatrix);

  if (availableCols.length > 0) {
    stateVar.currentUserRefCellIndex =
      availableCols[Math.floor(Math.random() * availableCols.length)];
    stateVar.currentlySelectedPieceMatrix = trimmedMatrix;
    updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
  } else {
    stateVar.blockedPieces.push(checknotation);
    // eslint-disable-next-line no-use-before-define
    generateUnblockedPiece();
  }
}

function generateOPiece() {
  generateTetrisPiece(tetrisPieces.OPieceMatrix, "O");
}

function generateIPiece() {
  generateTetrisPiece(tetrisPieces.IPieceMatrix, "I");
}

function generateJPiece() {
  generateTetrisPiece(tetrisPieces.JPieceMatrix, "J");
}

function generateLPiece() {
  generateTetrisPiece(tetrisPieces.LPieceMatrix, "L");
}

function generateSPiece() {
  generateTetrisPiece(tetrisPieces.SPieceMatrix, "S");
}

function generateZPiece() {
  generateTetrisPiece(tetrisPieces.ZPieceMatrix, "Z");
}

function generateTPiece() {
  generateTetrisPiece(tetrisPieces.TPieceMatrix, "T");
}

export function generateFirstPiece() {
  // Instead of generating a random piece, the seven piece system is implemented to provide a better user experience
  if (stateVar.sevenBag.length === 0) {
    fillSevenBag();
  }

  const randomSelIndex = Math.floor(Math.random() * stateVar.sevenBag.length);
  const randomSel = stateVar.sevenBag[randomSelIndex];
  stateVar.sevenBag.splice(randomSelIndex, 1);

  switch (randomSel) {
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
    default:
  }
}

export function generateNextPiece() {
  switch (stateVar.nextPieceMatrix) {
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
    default:
  }
}

export async function generateUnblockedPiece() {
  if (stateVar.blockedPieces.length === stateVar.pieces.length) {
    stateVar.gameOver = true;
    await docElems.mainLoopMusic.pause();
    if (stateVar.score >= stateVar.highScore) {
      handleEndGame("newHighScore");
      await docElems.newHighScoreSound.play();
    } else {
      handleEndGame("gameOver");
      await docElems.gameOverSound.play();
    }
    clearInterval(stateVar.pieceDownInterval);
    stateVar.pieceDownInterval = null;
  } else {
    stateVar.pieces.some((piece) => {
      if (!stateVar.blockedPieces.includes(piece)) {
        switch (piece) {
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
          default:
        }
        return true;
      }
      return false;
    });
  }
}

export function movePieceRight() {
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
    clearBricks.clearFloatingBricks();
    clearBricks.clearFloorGuideBricks();
    stateVar.currentUserRefCellIndex += 1;
    updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
  } else {
    // console.log("The piece has hit a right wall");
  }
}

export function movePieceLeft() {
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
    clearBricks.clearFloatingBricks();
    clearBricks.clearFloorGuideBricks();

    stateVar.currentUserRefCellIndex -= 1;

    updateCurrentUserArray();

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
  updateCurrentUserArray();
  stateVar.currentUserArray.forEach(addBricks.addFlooredBricks);
  docElems.floorDropSound.currentTime = 0;
  docElems.floorDropSound.play();
  // eslint-disable-next-line no-use-before-define
  brickHitBottomLogic();
}

export function movePieceDown() {
  clearBricks.clearFloatingBricks();
  clearBricks.clearFloorGuideBricks();
  updateCurrentUserArray();
  if (!stateEnquiry.checkFloor()) {
    stateVar.currentUserRefCellIndex += stateVar.noOfCols;
    updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
    stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
  } else {
    stateVar.currentUserArray.forEach(addBricks.addFlooredBricks);
    docElems.floorDropSound.currentTime = 0;
    docElems.floorDropSound.play();
    // eslint-disable-next-line no-use-before-define
    brickHitBottomLogic();
  }
}

export function unPauseGame() {
  if (!stateVar.gameOver && stateVar.paused) {
    stateVar.paused = false;
    if (!stateVar.pieceDownInterval) {
      stateVar.pieceDownInterval = setInterval(
        movePieceDown,
        stateVar.gameSpeed,
      );
    }
  }
}

export function handleGameUnPause() {
  if (
    !stateVar.gameOver &&
    !docElems.boardHeightWarningModalDOM.classList.contains("show")
  ) {
    docElems.mainLoopMusic.play();
    unPauseGame();
  }
}

export function startGame() {
  stateVar.gameOver = false;
  stateVar.paused = false;
  docElems.mainLoopMusic.currentTime = 0;
  docElems.mainLoopMusic.play();
  docElems.mainGridContainer.innerHTML = "";
  docElems.nextPieceContainer1.innerHTML = "";
  docElems.statusHeading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> <i class="bi bi-arrow-right-square"></i> <i class="bi bi-shift"></i> and Space / drag to play`;
  stateVar.boardSize = stateVar.noOfRows * stateVar.noOfCols;
  addBricks.generateGridCells();
  resetCurrentArrays();
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth",
  });
  stateVar.blockedPieces = [];
  stateVar.score = 0;
  docElems.scoreValue.innerHTML = stateVar.score;
  docElems.highScoreValue.innerHTML = stateVar.highScore;
  generateFirstPiece();
  selectNextPiece();
  addBricks.updateNextPieceIndicator();
  if (stateVar.pieceDownInterval) {
    clearInterval(stateVar.pieceDownInterval);
  }
  stateVar.pieceDownInterval = setInterval(movePieceDown, stateVar.gameSpeed);
}

export function handleUsersettings(e) {
  e.preventDefault();

  let checkCustomCol;
  let checkCustomRow;
  let checkCustomSpeed;

  validLocal = true;
  docElems.customColInvalidFeedback.classList.remove("invalid-feedback");
  docElems.customRowInvalidFeedback.classList.remove("invalid-feedback");
  docElems.customSpeedInvalidFeedback.classList.remove("invalid-feedback");

  if (docElems.noOfColsSel.value === "custom") {
    checkCustomCol = parseInt(docElems.customColsSel.value, 10);
    if (
      !docElems.customColsSel.value ||
      checkCustomCol < 5 ||
      checkCustomCol > 50
    ) {
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
  } else {
    validColSize = parseInt(docElems.noOfColsSel.value, 10);
  }

  if (docElems.noOfRowsSel.value === "custom") {
    checkCustomRow = parseInt(docElems.customRowsSel.value, 10);
    if (
      !docElems.customRowsSel.value ||
      checkCustomRow < 10 ||
      checkCustomRow > 100
    ) {
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
  } else {
    validRowSize = parseInt(docElems.noOfRowsSel.value, 10);
  }

  if (docElems.gameSpeedSel.value === "custom") {
    checkCustomSpeed = parseInt(docElems.customSpeedSel.value, 10);
    if (
      !docElems.customSpeedSel.value ||
      checkCustomSpeed < 25 ||
      checkCustomSpeed > 5000
    ) {
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
  } else {
    validSpeed = parseInt(docElems.gameSpeedSel.value, 10);
  }

  if (docElems.gameControlSel.value === "No") {
    validSwap = false;
  } else {
    validSwap = true;
  }

  if (validLocal === false) {
    return;
  }
  stateVar.validSettings = true;
  // A board check can be added here to automatically change the user's selection to have board size not exceeding vh

  const cellWidth = stateVar.boardWidth / validColSize;

  const boardHeight =
    stateVar.boardWidth + cellWidth * (validRowSize - validColSize);
  // checks if the board height exceeds the whole window height
  const boardHeightCheck = genFunc.checkBoardHeight(boardHeight);
  genFunc.handleLocalScoreInitialize();
  if (boardHeightCheck) {
    docElems.boardHeightWarningModal.show();
    docElems.startGameModal.hide();
  } else {
    setBoardDimensions(validColSize, validRowSize, validSpeed, validSwap);
    docElems.startGameModal.hide();
    startGame();
  }
}

export function handleSettingsConfirm() {
  if (stateVar.validSettings) {
    setBoardDimensions(validColSize, validRowSize, validSpeed, validSwap);
    docElems.boardHeightWarningModal.hide();
    startGame();
  }
}

export function rotatePieceClockwise() {
  // sound effect
  docElems.pieceRotate.currentTime = 0;
  docElems.pieceRotate.play();

  clearBricks.clearFloatingBricks();
  clearBricks.clearFloorGuideBricks();
  updateCurrentUserArray();
  const prevUserArr = stateVar.currentUserArray;

  const currentMatrixLength = stateVar.currentlySelectedPieceMatrix[0].length;
  const currentMatrixHeight = stateVar.currentlySelectedPieceMatrix.length;
  const dimensionDifference = Math.abs(
    currentMatrixLength - currentMatrixHeight,
  );

  const colMap = stateVar.currentUserArray.map((index) => {
    return index % stateVar.noOfCols;
  });

  const rowMap = stateVar.currentUserArray.map((index) => {
    return Math.floor(index / stateVar.noOfCols);
  });

  const rightmostCol = Math.max(...colMap);

  const bottommostRow = Math.max(...rowMap);

  const rightOverflowCheck = rightmostCol + dimensionDifference;
  const bottomOverflowCheck = bottommostRow + dimensionDifference;

  // Right walls check

  let leftCascading = false;

  if (
    rightOverflowCheck > stateVar.noOfCols - 1 &&
    currentMatrixHeight > currentMatrixLength
  ) {
    stateVar.currentUserRefCellIndex -=
      rightOverflowCheck - (stateVar.noOfCols - 1);
    leftCascading = true;
  }

  // Bottom walls check
  let upperCascading = false;

  if (
    bottomOverflowCheck > stateVar.noOfRows - 1 &&
    currentMatrixHeight < currentMatrixLength
  ) {
    stateVar.currentUserRefCellIndex -=
      (bottomOverflowCheck - (stateVar.noOfRows - 1)) * stateVar.noOfCols;
    upperCascading = true;
  }

  const checkWallInRotationMat = genFunc.rotateMatrixClockwise(
    stateVar.currentlySelectedPieceMatrix,
  );
  stateVar.currentlySelectedPieceMatrix = checkWallInRotationMat;

  updateCurrentUserArray();
  const bricksInTheWay = stateVar.currentUserArray.filter((index) => {
    return stateVar.cellsArr[index].classList.contains("flooredBrick");
  });

  if (bricksInTheWay.length > 0) {
    // Revert rotation if there are bricks in the way of the final location
    stateVar.currentUserArray = prevUserArr;
    const revertRotationMat = genFunc.rotateMatrixAntiClockwise(
      stateVar.currentlySelectedPieceMatrix,
    );
    stateVar.currentlySelectedPieceMatrix = revertRotationMat;
    if (leftCascading === true) {
      stateVar.currentUserRefCellIndex +=
        rightOverflowCheck - (stateVar.noOfCols - 1);
      leftCascading = false;
    }

    if (upperCascading === true) {
      stateVar.currentUserRefCellIndex +=
        (bottomOverflowCheck - (stateVar.noOfRows - 1)) * stateVar.noOfCols;
      upperCascading = false;
    }
  }

  stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
  stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
}

export function rotatePieceAntiClockwise() {
  docElems.pieceRotate.currentTime = 0;
  docElems.pieceRotate.play();
  clearBricks.clearFloatingBricks();
  clearBricks.clearFloorGuideBricks();
  updateCurrentUserArray();
  const prevUserArr = stateVar.currentUserArray;

  const currentMatrixLength = stateVar.currentlySelectedPieceMatrix[0].length;
  const currentMatrixHeight = stateVar.currentlySelectedPieceMatrix.length;
  const dimensionDifference = Math.abs(
    currentMatrixLength - currentMatrixHeight,
  );

  const colMap = stateVar.currentUserArray.map((index) => {
    return index % stateVar.noOfCols;
  });

  const rowMap = stateVar.currentUserArray.map((index) => {
    return Math.floor(index / stateVar.noOfCols);
  });

  const rightmostCol = Math.max(...colMap);

  const bottommostRow = Math.max(...rowMap);

  const rightOverflowCheck = rightmostCol + dimensionDifference;
  const bottomOverflowCheck = bottommostRow + dimensionDifference;

  // Right walls check

  let leftCascading = false;

  if (
    rightOverflowCheck > stateVar.noOfCols - 1 &&
    currentMatrixHeight > currentMatrixLength
  ) {
    stateVar.currentUserRefCellIndex -=
      rightOverflowCheck - (stateVar.noOfCols - 1);
    leftCascading = true;
  }

  // Bottom walls check
  let upperCascading = false;

  if (
    bottomOverflowCheck > stateVar.noOfRows - 1 &&
    currentMatrixHeight < currentMatrixLength
  ) {
    stateVar.currentUserRefCellIndex -=
      (bottomOverflowCheck - (stateVar.noOfRows - 1)) * stateVar.noOfCols;
    upperCascading = true;
  }

  const checkWallInRotationMat = genFunc.rotateMatrixAntiClockwise(
    stateVar.currentlySelectedPieceMatrix,
  );
  stateVar.currentlySelectedPieceMatrix = checkWallInRotationMat;

  updateCurrentUserArray();
  const bricksInTheWay = stateVar.currentUserArray.filter((index) => {
    return stateVar.cellsArr[index].classList.contains("flooredBrick");
  });

  if (bricksInTheWay.length > 0) {
    // Revert rotation if there are bricks in the way of the final location
    stateVar.currentUserArray = prevUserArr;
    const revertRotationMat = genFunc.rotateMatrixClockwise(
      stateVar.currentlySelectedPieceMatrix,
    );
    stateVar.currentlySelectedPieceMatrix = revertRotationMat;
    if (leftCascading === true) {
      stateVar.currentUserRefCellIndex +=
        rightOverflowCheck - (stateVar.noOfCols - 1);
      leftCascading = false;
    }

    if (upperCascading === true) {
      stateVar.currentUserRefCellIndex +=
        (bottomOverflowCheck - (stateVar.noOfRows - 1)) * stateVar.noOfCols;
      upperCascading = false;
    }
  }

  stateVar.currentUserArray.forEach(addBricks.addFloatingBricks);
  stateVar.floorGuideArray.forEach(addBricks.addFloorGuideBricks);
}

export function handleKeyPress(e) {
  if (!stateVar.gameOver && !stateVar.paused) {
    if (e.target.tagName === "INPUT") return;

    e.preventDefault();
    if (e.key === "ArrowLeft") {
      movePieceLeft();
    }

    if (e.key === "ArrowRight") {
      movePieceRight();
    }

    if (e.key === "ArrowDown") {
      movePieceDown();
    }

    if (e.key === " ") {
      if (!stateVar.swapSpaceBar) instaDrop();
      else rotatePieceClockwise();
    }

    if (e.key === "ArrowUp") {
      if (stateVar.swapSpaceBar) instaDrop();
      else rotatePieceClockwise();
    }

    if (e.key === "Shift") {
      rotatePieceAntiClockwise();
    }
  }
}

function nextPieceLogic() {
  resetCurrentArrays();
  generateNextPiece();
  selectNextPiece();
  addBricks.updateNextPieceIndicator();
}

export async function brickHitBottomLogic() {
  const rowsOfBricked = stateEnquiry.getRowsOfBricked();

  // Checking for gameOver condition
  if (rowsOfBricked.includes(0)) {
    clearInterval(stateVar.pieceDownInterval);
    stateVar.pieceDownInterval = null;
    stateVar.gameOver = true;
    await docElems.mainLoopMusic.pause();
    if (stateVar.score >= stateVar.highScore) {
      await docElems.newHighScoreSound.play();
      handleEndGame("newHighScore");
    } else {
      await docElems.gameOverSound.play();
      handleEndGame("gameOver");
    }
  }

  if (!stateVar.gameOver) {
    const fullRowsArr = stateEnquiry.getFullRowsArray(rowsOfBricked);
    if (fullRowsArr.length > 0) {
      pauseGame();
      setTimeout(() => {
        clearBricks.clearFullRows(fullRowsArr);
        // The floored bricks would still be floating in place b/w the rows which are just cleared needs to shift down
        clearBricks.shiftBricks(fullRowsArr);
        nextPieceLogic();
        unPauseGame();
      }, 200);
    } else {
      nextPieceLogic();
    }
  }
}
