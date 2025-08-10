// This module contains general functions that can be used independently of game state or other custom functions

// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../globalVariables/docElems.js";

// #region general matrix rotate functions
export function rotateMatrixClockwise(mat) {
  const tempMatrix = [];
  for (let i = 0; i < mat[0].length; i += 1) {
    const tempArr = [];
    for (let j = mat.length - 1; j >= 0; j -= 1) {
      tempArr.push(mat[j][i]);
    }
    tempMatrix.push(tempArr);
  }
  return tempMatrix;
}

export function rotateMatrixAntiClockwise(mat) {
  const tempMatrix = [];

  for (let i = mat[0].length - 1; i >= 0; i -= 1) {
    const tempArr = [];
    for (let j = 0; j < mat.length; j += 1) {
      tempArr.push(mat[j][i]);
    }
    tempMatrix.push(tempArr);
  }
  return tempMatrix;
}
// #endregion general matrix rotate functions

export function shuffleArray(array) {
  const temparr = [...array];
  let indexToCheck = array.length;
  let randomIndex;

  while (indexToCheck > 0) {
    randomIndex = Math.floor(Math.random() * indexToCheck);
    indexToCheck -= 1;
    [temparr[indexToCheck], temparr[randomIndex]] = [
      temparr[randomIndex],
      temparr[indexToCheck],
    ];
  }

  return temparr;
}

// #region function for trimming a piecematrix for "false" only rows and columns at the ends

// For potential future features where a custom piece matrix could have multiple false only rows at the bottom
export function trimMatrixBottom(pieceMatrix) {
  let lastRealRow = pieceMatrix.length - 1;
  let lastRealRowItems = pieceMatrix[lastRealRow];

  while (!lastRealRowItems.includes(true) && lastRealRow >= 0) {
    lastRealRow -= 1;
    lastRealRowItems = pieceMatrix[lastRealRow];
  }
  return pieceMatrix.slice(0, lastRealRow + 1);
}

// For potential future features where a custom piece matrix could have multiple false only rows at the top
export function trimMatrixTop(pieceMatrix) {
  let firstRealRow = 0;
  let firstRealRowItems = pieceMatrix[firstRealRow];

  while (
    !firstRealRowItems.includes(true) &&
    firstRealRow < pieceMatrix.length
  ) {
    firstRealRow += 1;
    firstRealRowItems = pieceMatrix[firstRealRow];
  }
  return pieceMatrix.slice(firstRealRow);
}

// For potential future features where a custom piece matrix could have multiple false only columns at the right
export function trimMatrixRight(pieceMatrix) {
  let lastRealCol = pieceMatrix[0].length - 1;

  // going from right to left on outer loop and top to bottom on inner loop
  for (let i = lastRealCol; i >= 0; i -= 1) {
    let localFalseCounter = 0;
    for (let j = 0; j < pieceMatrix.length; j += 1) {
      if (!pieceMatrix[j][i]) {
        localFalseCounter += 1;
      }
    }
    if (!(localFalseCounter === pieceMatrix.length)) {
      lastRealCol = i;
      break;
    }
  }
  const rightSlicedMatrix = pieceMatrix.map((row) => {
    return row.slice(0, lastRealCol + 1);
  });

  return rightSlicedMatrix;
}

// For potential future features where a custom piece matrix could have multiple false only columns at the left
export function trimMatrixLeft(pieceMatrix) {
  let firstRealCol = 0;

  for (let i = firstRealCol; i < pieceMatrix[0].length; i += 1) {
    let localFalseCounter = 0;
    for (let j = 0; j < pieceMatrix.length; j += 1) {
      if (!pieceMatrix[j][i]) {
        localFalseCounter += 1;
      }
    }
    if (!(localFalseCounter === pieceMatrix.length)) {
      firstRealCol = i;
      break;
    }
  }
  const leftSlicedMatrix = pieceMatrix.map((row) => {
    return row.slice(firstRealCol);
  });

  return leftSlicedMatrix;
}

export function trimAllMatrixSides(pieceMatrix) {
  return trimMatrixBottom(
    trimMatrixTop(trimMatrixRight(trimMatrixLeft(pieceMatrix))),
  );
}

// #endregion function for trimming a piecematrix for "false" only rows and columns at the ends

// #region function for getting the heights of columns of a tetris piece matrix till the first "false" only rows
export function getDepthMap(pieceMatrix) {
  let lastRow = pieceMatrix.length - 1;
  let lastRowItems = pieceMatrix[lastRow];
  const lastRowMap = lastRowItems.map((cell) => (cell ? 1 : 0));

  // For potential future features where a custom piece matrix could have multiple false only rows at the bottom
  while (!lastRowMap.includes(1) && lastRow >= 0) {
    lastRow -= 1;
    // The last lastRowItems returns an array of the true and false values of the first true last row
    lastRowItems = pieceMatrix[lastRow];
    // lastRowMap = lastRowItems.map((cell) => (cell ? 1 : 0));
  }

  const relativeRowHeightMap = lastRowItems.map((lastRowItem, itemIndex) => {
    let depth = 0;
    if (!lastRowItem) {
      for (let i = lastRow - 1; i >= 0; i -= 1) {
        if (!pieceMatrix[i][itemIndex]) {
          depth -= 1;
        } else {
          break;
        }
      }
    }
    return depth;
  });

  // Piece height after the height of the false only rows are trimmed out from the bottom of the pieceMatrix
  const pieceHeight1 = lastRow + 1;
  const depthMap = relativeRowHeightMap.map((col) => {
    return col + pieceHeight1;
  });
  return depthMap;
}

// #endregion function for getting the heights of columns of a tetris piece matrix till the first "false" only rows

// #region logic for the settings selection in bootstrap modal
export function toggleCustomDisplay(
  event,
  customInput,
  customLabel,
  customFeedback,
) {
  if (event.target.value === "custom") {
    customInput.removeAttribute("hidden");
    customInput.removeAttribute("disabled");
    customInput.removeAttribute("required");
    customLabel.removeAttribute("hidden");
    customFeedback.removeAttribute("hidden");
  } else {
    customInput.setAttribute("hidden", "true");
    customInput.setAttribute("disabled", "true");
    customInput.setAttribute("required", "true");
    customLabel.setAttribute("hidden", "true");
    customFeedback.setAttribute("hidden", "true");
  }
}

export function toggleInvalidFeedback(inputBox, feedbackBox) {
  let check;
  const checkInputBox = parseInt(inputBox.value, 10);
  if (inputBox === docElems.customColsSel) {
    check = !inputBox.value || checkInputBox < 5 || checkInputBox > 50;
  } else if (inputBox === docElems.customRowsSel) {
    check = !inputBox.value || checkInputBox < 10 || checkInputBox > 100;
  } else if (inputBox === docElems.customSpeedSel) {
    check = !inputBox.value || checkInputBox < 25 || checkInputBox > 5000;
  }

  if (check) {
    inputBox.classList.add("is-invalid");
    inputBox.classList.remove("is-valid");
    feedbackBox.classList.add("invalid-feedback");
    feedbackBox.removeAttribute("hidden");
  } else {
    inputBox.classList.add("is-valid");
    inputBox.classList.remove("is-invalid");
    feedbackBox.classList.remove("invalid-feedback");
    feedbackBox.setAttribute("hidden", "true");
  }
}

export function checkBoardHeight(boardHeight) {
  return boardHeight > window.innerHeight;
}

// #endregion logic for the settings selection in bootstrap modal

// #region logic for sound and music volume

export function toggleMusic(e) {
  if (e.target.classList.contains("bi-file-music-fill")) {
    e.target.classList.remove("bi-file-music-fill");
    e.target.classList.add("bi-file-music");
    docElems.mainLoopMusic.muted = true;
  } else {
    e.target.classList.remove("bi-file-music");
    e.target.classList.add("bi-file-music-fill");
    docElems.mainLoopMusic.muted = false;
  }
}

export function toggleSounds(e) {
  if (e.target.classList.contains("bi-volume-down-fill")) {
    e.target.classList.remove("bi-volume-down-fill");
    e.target.classList.add("bi-volume-mute");
    docElems.gameOverSound.muted = true;
    docElems.newHighScoreSound.muted = true;
    docElems.floorDropSound.muted = true;
    docElems.pauseSound.muted = true;
    docElems.pieceRotate.muted = true;
    docElems.rowCleared.muted = true;
  } else {
    e.target.classList.remove("bi-volume-mute");
    e.target.classList.add("bi-volume-down-fill");
    docElems.gameOverSound.muted = false;
    docElems.newHighScoreSound.muted = false;
    docElems.floorDropSound.muted = false;
    docElems.pauseSound.muted = false;
    docElems.pieceRotate.muted = false;
    docElems.rowCleared.muted = false;
  }
}

export function preLoadSoundFile(soundVariable) {
  // Airbnb ESLint rules does not allow direct assignment of property values to a parameter
  const sound = soundVariable;
  sound.preload = "auto";
  sound.load();
}

// #endregion logic for sound and music volume

// #region function for checking if the contents of two arrays are equal

export function checkArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  for (let i = 0; i < arr1.length; i += 1) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

// #endregion function for checking if the contents of two arrays are equal

// #region logic for grabbing a high score entry stored as [noOfCols, noOfRows, gameSpeed, highScore] from local storage

export function handleLocalScoreInitialize() {
  const localScores = JSON.parse(localStorage.getItem("localHighScores"));
  if (localScores == null) {
    localStorage.setItem("localHighScores", JSON.stringify([]));
  }
}

export function checkHighScore(cols, rows, speed) {
  const localScores = JSON.parse(localStorage.getItem("localHighScores"));
  const highScoreCheck = localScores.filter((arrayItem) => {
    // Items are stored in cols, rows, speed and highScore value combinations
    return (
      arrayItem[0] === cols && arrayItem[1] === rows && arrayItem[2] === speed
    );
  });
  return highScoreCheck;
}

// #endregion logic for grabbing a high score entry stored as [noOfCols, noOfRows, gameSpeed, highScore] from local storage
