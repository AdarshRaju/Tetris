// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains the game's state variables
import { stateVar } from "../../globalVariables/stateVars.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../generalFunctions.js";

export function clearFullRows(fullRowsArr) {
  docElems.rowCleared.currentTime = 0;
  docElems.rowCleared.play();
  fullRowsArr.forEach((fullRow) => {
    let startingInd = parseInt(fullRow) * stateVar.noOfCols;
    let finishingInd = startingInd + (stateVar.noOfCols - 1);

    for (let i = startingInd; i <= finishingInd; i++) {
      stateVar.cellsArr[i].classList.remove("flooredBrick");
    }
    stateVar.score++;
    docElems.scoreValue.innerHTML = stateVar.score;
    if (stateVar.score > stateVar.highScore) {
      stateVar.highScore = stateVar.score;

      let localHighScores = JSON.parse(localStorage.getItem("localHighScores"));
      let prevHighScoreEntry = genFunc.checkHighScore(
        stateVar.noOfCols,
        stateVar.noOfRows,
        stateVar.gameSpeed
      );
      // console.log("prevHighScoreEntry returned is:", prevHighScoreEntry);
      if (prevHighScoreEntry.length > 0) {
        // find item from local, modify it, put it back again
        console.log("localHighScores returned as:", localHighScores);

        let existingEntryIndex = localHighScores.findIndex((arrEntry) => {
          console.log(
            "genFunc.checkArraysEqual(arrEntry, prevHighScoreEntry[0]) returned as: ",
            genFunc.checkArraysEqual(arrEntry, prevHighScoreEntry[0])
          );
          return (
            Array.isArray(arrEntry) &&
            genFunc.checkArraysEqual(arrEntry, prevHighScoreEntry[0])
          );
        });
        console.log("existingEntryIndex returned as:", existingEntryIndex);
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

function getLocalHighScores() {}

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
