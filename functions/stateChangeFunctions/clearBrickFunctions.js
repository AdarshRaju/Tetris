// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains the game's state variables
import stateVar from "../../globalVariables/stateVars.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../generalFunctions.js";

export function clearFullRows(fullRowsArr) {
  docElems.rowCleared.currentTime = 0;
  docElems.rowCleared.play();
  fullRowsArr.forEach((fullRow) => {
    const startingInd = parseInt(fullRow, 10) * stateVar.noOfCols;
    const finishingInd = startingInd + (stateVar.noOfCols - 1);

    for (let i = startingInd; i <= finishingInd; i += 1) {
      stateVar.cellsArr[i].classList.remove("flooredBrick");
    }
    stateVar.score += 1;
    docElems.scoreValue.innerHTML = stateVar.score;
    if (stateVar.score > stateVar.highScore) {
      stateVar.highScore = stateVar.score;

      const localScore = localStorage.getItem("localHighScores");
      const localHighScores = JSON.parse(localScore);
      const prevHighScoreEntry = genFunc.checkHighScore(
        stateVar.noOfCols,
        stateVar.noOfRows,
        stateVar.gameSpeed,
      );

      if (prevHighScoreEntry.length > 0) {
        // find item from local, modify it, put it back again

        const existingEntryIndex = localHighScores.findIndex((arrEntry) => {
          return (
            Array.isArray(arrEntry) &&
            genFunc.checkArraysEqual(arrEntry, prevHighScoreEntry[0])
          );
        });
        localHighScores[existingEntryIndex][3] = stateVar.highScore;
      } else {
        // create a new high score entry in the local storage
        localHighScores.push([
          stateVar.noOfCols,
          stateVar.noOfRows,
          stateVar.gameSpeed,
          stateVar.highScore,
        ]);
      }
      localStorage.setItem("localHighScores", JSON.stringify(localHighScores));
    }
    docElems.highScoreValue.innerHTML = stateVar.highScore;
  });
}

function handleClassClearing(stateArray, removeClassName) {
  let nonexistentindex = false;
  stateArray.forEach((index) => {
    if (stateVar.cellsArr[index]) {
      stateVar.cellsArr[index].classList.remove(removeClassName);
    } else {
      nonexistentindex = true;
    }
  });
  if (nonexistentindex) {
    stateVar.cellsArr.forEach((cell) => {
      cell.classList.remove(removeClassName);
    });
  }
}

export function clearFloatingBricks() {
  handleClassClearing(stateVar.currentUserArray, "floatingBrick");
}

export function clearFloorGuideBricks() {
  handleClassClearing(stateVar.floorGuideArray, "floorCheckBrick");
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
