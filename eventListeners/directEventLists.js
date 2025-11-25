// This module contains all the eventlisteners that are used in the project

// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../globalVariables/docElems.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../functions/generalFunctions.js";
// The module imported below contains the game's major state change functions
import * as stateChange from "../functions/stateChangeFunctions/generalGameFunctions.js";
// The module imported below contains the game's state variables
import stateVar from "../globalVariables/stateVars.js";

// These are event listeners that are independent of gamestate

export function setUpIndependentEventListeners() {
  window.addEventListener("load", () => {
    genFunc.preLoadSoundFile(docElems.newHighScoreSound);
    genFunc.preLoadSoundFile(docElems.gameOverSound);
    genFunc.preLoadSoundFile(docElems.floorDropSound);
    genFunc.preLoadSoundFile(docElems.mainLoopMusic);
    genFunc.preLoadSoundFile(docElems.pauseSound);
    genFunc.preLoadSoundFile(docElems.pieceRotate);
    genFunc.preLoadSoundFile(docElems.rowCleared);
  });

  docElems.musicTriggerBtn.addEventListener("click", genFunc.toggleMusic);

  docElems.soundTriggerBtn.addEventListener("click", genFunc.toggleSounds);

  docElems.noOfColsSel.addEventListener("change", (e) => {
    genFunc.toggleCustomDisplay(
      e,
      docElems.customColsSel,
      docElems.labelCustomColsSel,
      docElems.customColInvalidFeedback,
    );
  });

  docElems.noOfRowsSel.addEventListener("change", (e) => {
    genFunc.toggleCustomDisplay(
      e,
      docElems.customRowsSel,
      docElems.labelCustomRowsSel,
      docElems.customRowInvalidFeedback,
    );
  });

  docElems.gameSpeedSel.addEventListener("change", (e) => {
    genFunc.toggleCustomDisplay(
      e,
      docElems.customSpeedSel,
      docElems.labelCustomSpeedSel,
      docElems.customSpeedInvalidFeedback,
    );
  });

  docElems.customColsSel.addEventListener("change", () => {
    if (!docElems.customColsSel.disabled) {
      genFunc.toggleInvalidFeedback(
        docElems.customColsSel,
        docElems.customColInvalidFeedback,
      );
    }
  });

  docElems.customRowsSel.addEventListener("change", () => {
    if (!docElems.customRowsSel.disabled) {
      genFunc.toggleInvalidFeedback(
        docElems.customRowsSel,
        docElems.customRowInvalidFeedback,
      );
    }
  });

  docElems.customSpeedSel.addEventListener("change", () => {
    if (!docElems.customSpeedSel.disabled) {
      genFunc.toggleInvalidFeedback(
        docElems.customSpeedSel,
        docElems.customSpeedInvalidFeedback,
      );
    }
  });
}

// These are event listeners that are dependent on gamestate such as whether the game has started, game is paused, or gameover was triggered
export function setUpDependentEventListeners() {
  document.addEventListener("keydown", stateChange.handleKeyPress);

  docElems.moveLeftBtn.addEventListener("click", () => {
    stateChange.buttonClickValidation(stateChange.movePieceLeft);
  });

  docElems.moveRightBtn.addEventListener("click", () => {
    stateChange.buttonClickValidation(stateChange.movePieceRight);
  });

  docElems.moveDownBtn1.addEventListener("mousedown", () => {
    stateChange.buttonClickValidation(stateChange.movePieceDown);
  });

  docElems.moveDownBtn2.addEventListener("mousedown", () => {
    stateChange.buttonClickValidation(stateChange.movePieceDown);
  });

  docElems.rotateClockwiseBtn.addEventListener("click", () => {
    stateChange.buttonClickValidation(stateChange.rotatePieceClockwise);
  });

  docElems.rotateAntiClockwiseBtn.addEventListener("click", () => {
    stateChange.buttonClickValidation(stateChange.rotatePieceAntiClockwise);
  });

  docElems.instaDownBtn1.addEventListener("click", () => {
    stateChange.buttonClickValidation(stateChange.instaDrop);
  });

  docElems.instaDownBtn2.addEventListener("click", () => {
    stateChange.buttonClickValidation(stateChange.instaDrop);
  });

  // Preserves browser form value validation for use in bootstrap
  docElems.form.addEventListener("submit", stateChange.handleUsersettings);

  docElems.confirmSettingsBtn.addEventListener(
    "click",
    stateChange.handleSettingsConfirm,
  );

  docElems.startButton.addEventListener("click", () => {
    if (!stateVar.gameOver) {
      docElems.mainLoopMusic.pause();
      docElems.pauseSound.currentTime = 0;
      docElems.pauseSound.play();
      stateChange.pauseGame();
    }
  });

  docElems.startGameModalDOM.addEventListener(
    "hidden.bs.modal",
    stateChange.handleGameUnPause,
  );
}

// #region logic for touchscreens

export function setUpTouchControls() {
  docElems.mainGridContainer.addEventListener(
    "touchmove",
    (e) => e.preventDefault(),
    { passive: false },
  );

  const leftKeyEvent = new KeyboardEvent("keydown", {
    key: "ArrowLeft",
  });

  const rightKeyEvent = new KeyboardEvent("keydown", {
    key: "ArrowRight",
  });

  const upKeyEvent = new KeyboardEvent("keydown", {
    key: "ArrowUp",
  });

  const downKeyEvent = new KeyboardEvent("keydown", {
    key: "ArrowDown",
  });

  function handleGesture() {
    const deltaX = stateVar.endX - stateVar.startX;
    const deltaY = stateVar.endY - stateVar.startY;

    let regX = false;
    let regY = false;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      regX = true;
    } else {
      regY = true;
    }

    if (Math.abs(deltaX) > 50 && regX) {
      if (deltaX > 0) {
        document.dispatchEvent(rightKeyEvent);
      } else {
        document.dispatchEvent(leftKeyEvent);
      }
    }

    if (Math.abs(deltaY) > 50 && regY) {
      if (deltaY > 0) {
        document.dispatchEvent(downKeyEvent);
      } else {
        document.dispatchEvent(upKeyEvent);
      }
    }
  }

  docElems.mainGridContainer.addEventListener("dragstart", (e) =>
    e.preventDefault(),
  );

  docElems.mainGridContainer.addEventListener("mousedown", (e) => {
    stateVar.startX = e.clientX;
    stateVar.startY = e.clientY;
  });

  docElems.mainGridContainer.addEventListener("mouseup", (e) => {
    stateVar.endX = e.clientX;
    stateVar.endY = e.clientY;

    handleGesture();
  });

  docElems.mainGridContainer.addEventListener("touchstart", (e) => {
    stateVar.startX = e.touches[0].clientX;
    stateVar.startY = e.touches[0].clientY;
  });

  docElems.mainGridContainer.addEventListener("touchend", (e) => {
    stateVar.endX = e.changedTouches[0].clientX;
    stateVar.endY = e.changedTouches[0].clientY;

    handleGesture();
  });
}

// #endregion logic for touchscreens
