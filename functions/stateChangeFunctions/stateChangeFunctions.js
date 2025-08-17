// The module imported below contains the game's state variables
import stateVar from "../../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../generalFunctions.js";

export function pauseGameFunction() {
  if (!stateVar.paused && !stateVar.gameOver) {
    stateVar.paused = true;
    clearInterval(stateVar.pieceDownInterval);
    stateVar.pieceDownInterval = null;
  }
}

export function resetCurrentArraysFunction(
  clearFloatingBricks,
  clearFloorGuideBricks,
) {
  clearFloatingBricks();
  clearFloorGuideBricks();
  stateVar.currentUserRefCellIndex = 0;
  stateVar.currentUserArray = [];
  stateVar.floorGuideArray = [];
  stateVar.currentlySelectedPieceMatrix = [];
}

export function handleEndGameFunction(classListToAdd) {
  document.body.classList.add(classListToAdd);

  if (classListToAdd === "newHighScore") {
    docElems.statusHeading.innerHTML =
      "Congrats! New High Score! Press start to play again";
  } else {
    docElems.statusHeading.innerHTML = "Game Over! Press start to play again";
  }
  setTimeout(() => document.body.classList.remove(classListToAdd), 200);
}

export function buttonClickValidationFunction(movefunction) {
  if (!stateVar.gameOver && !stateVar.paused) {
    return movefunction();
  }
  return null;
}

function updateCurrentFloorGuideArray(findFloor) {
  stateVar.floorGuideArray = [];
  const highestRow = findFloor();
  const refIndRow = Math.floor(
    stateVar.currentUserRefCellIndex / stateVar.noOfCols,
  );
  const noOfRowsToShift = highestRow - refIndRow - 1;

  stateVar.floorGuideArray = stateVar.currentUserArray.map((index) => {
    return index + noOfRowsToShift * stateVar.noOfCols;
  });
}

export function updateCurrentUserArrayFunction(findFloor) {
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
  updateCurrentFloorGuideArray(findFloor);
}

export function setBoardDimensionsFunction(cols, rows, speed, swap) {
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

export function selectNextPieceFunction(fillSevenBag, nextMatrixSet) {
  if (stateVar.sevenBag.length === 0) {
    fillSevenBag();
  }

  const nextPieceIndex = Math.floor(Math.random() * stateVar.sevenBag.length);
  const nextPiece = stateVar.sevenBag[nextPieceIndex];
  stateVar.sevenBag.splice(nextPieceIndex, 1);
  nextMatrixSet(nextPiece);
}

export function generateFirstPieceFunction(
  fillSevenBag,
  generateParticularPiece,
) {
  // Instead of generating a random piece, the seven piece system is implemented to provide a better user experience
  if (stateVar.sevenBag.length === 0) {
    fillSevenBag();
  }

  const randomSelIndex = Math.floor(Math.random() * stateVar.sevenBag.length);
  const randomSel = stateVar.sevenBag[randomSelIndex];
  stateVar.sevenBag.splice(randomSelIndex, 1);
  generateParticularPiece(undefined, randomSel);
}

export function unPauseGameFunction(movePieceDown) {
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

export function handleGameUnPauseFunction(unPauseGame) {
  if (
    !stateVar.gameOver &&
    !docElems.boardHeightWarningModalDOM.classList.contains("show")
  ) {
    docElems.mainLoopMusic.play();
    unPauseGame();
  }
}

export function startGameFunction(
  generateGridCells,
  resetCurrentArrays,
  generateFirstPiece,
  selectNextPiece,
  updateNextPieceIndicator,
  movePieceDown,
) {
  stateVar.gameOver = false;
  stateVar.paused = false;
  docElems.mainLoopMusic.currentTime = 0;
  docElems.mainLoopMusic.play();
  docElems.mainGridContainer.innerHTML = "";
  docElems.nextPieceContainer1.innerHTML = "";
  docElems.statusHeading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> <i class="bi bi-arrow-right-square"></i> <i class="bi bi-shift"></i> and Space / drag to play`;
  stateVar.boardSize = stateVar.noOfRows * stateVar.noOfCols;
  generateGridCells();
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
  updateNextPieceIndicator();
  if (stateVar.pieceDownInterval) {
    clearInterval(stateVar.pieceDownInterval);
  }
  stateVar.pieceDownInterval = setInterval(movePieceDown, stateVar.gameSpeed);
}

// The valid values from the user are temporarily stored in case the user triggers a board height warning and goes back to the old game
let validColSize;
let validRowSize;
let validSpeed;
let validSwap;
let validLocal;

export function handleUsersettingsFunction(e, setBoardDimensions, startGame) {
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

  const cellWidth = stateVar.BOARD_WIDTH / validColSize;

  const boardHeight =
    stateVar.BOARD_WIDTH + cellWidth * (validRowSize - validColSize);
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

export function handleSettingsConfirmFunction(setBoardDimensions, startGame) {
  if (stateVar.validSettings) {
    setBoardDimensions(validColSize, validRowSize, validSpeed, validSwap);
    docElems.boardHeightWarningModal.hide();
    startGame();
  }
}

export async function brickHitBottomLogicFunction(
  getRowsOfBricked,
  handleEndGame,
  getFullRowsArray,
  pauseGame,
  clearFullRows,
  shiftBricks,
  nextPieceLogic,
  unPauseGame,
) {
  const rowsOfBricked = getRowsOfBricked();

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
    const fullRowsArr = getFullRowsArray(rowsOfBricked);
    if (fullRowsArr.length > 0) {
      pauseGame();
      setTimeout(() => {
        clearFullRows(fullRowsArr);
        // The floored bricks would still be floating in place b/w the rows which are just cleared needs to shift down
        shiftBricks(fullRowsArr);
        nextPieceLogic();
        unPauseGame();
      }, 200);
    } else {
      nextPieceLogic();
    }
  }
}

export function handleKeyPressFunction(
  e,
  movePieceLeft,
  movePieceRight,
  movePieceDown,
  instaDrop,
  rotatePieceClockwise,
  rotatePieceAntiClockwise,
) {
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
