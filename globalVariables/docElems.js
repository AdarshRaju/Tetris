// This module is for storing the HTML DOM elements in variables

/* global bootstrap */
export const mainGridContainer = document.getElementById("mainGridContainer");
export const startButton = document.getElementById("startButton");
export const statusHeading = document.getElementById("statusHeading");
export const scoreValue = document.getElementById("scoreValue");
export const highScoreValue = document.getElementById("highScoreValue");
export const rotateAntiClockwiseBtn = document.getElementById(
  "rotateAntiClockwiseBtn",
);
export const moveLeftBtn = document.getElementById("moveLeftBtn");
export const rotateClockwiseBtn = document.getElementById("rotateClockwiseBtn");
export const moveRightBtn = document.getElementById("moveRightBtn");
export const moveDownBtn1 = document.getElementById("moveDownBtn1");
export const moveDownBtn2 = document.getElementById("moveDownBtn2");
export const instaDownBtn1 = document.getElementById("instaDownBtn1");
export const instaDownBtn2 = document.getElementById("instaDownBtn2");
export const noOfColsSel = document.getElementById("noOfColsSel");
export const noOfRowsSel = document.getElementById("noOfRowsSel");
export const gameSpeedSel = document.getElementById("gameSpeedSel");
export const gameControlSel = document.getElementById("gameControlSel");
export const customColsSel = document.getElementById("customColsSel");
export const customRowsSel = document.getElementById("customRowsSel");
export const customSpeedSel = document.getElementById("customSpeedSel");
export const labelCustomColsSel = document.getElementById("labelCustomColsSel");
export const labelCustomRowsSel = document.getElementById("labelCustomRowsSel");
export const labelCustomSpeedSel = document.getElementById(
  "labelCustomSpeedSel",
);
export const form = document.getElementById("form");
export const startGameModal = new bootstrap.Modal("#startGameModal");
export const startGameModalDOM = document.getElementById("startGameModal");
export const boardHeightWarningModal = new bootstrap.Modal(
  "#boardHeightWarningModal",
);
export const boardHeightWarningModalDOM = document.getElementById(
  "boardHeightWarningModal",
);
export const customColInvalidFeedback = document.getElementById(
  "customColInvalidFeedback",
);
export const customRowInvalidFeedback = document.getElementById(
  "customRowInvalidFeedback",
);
export const customSpeedInvalidFeedback = document.getElementById(
  "customSpeedInvalidFeedback",
);
export const confirmSettingsBtn = document.getElementById("confirmSettingsBtn");
export const nextPieceContainer1 = document.getElementById(
  "nextPieceContainer1",
);
export const nextPieceContainer2 = document.getElementById(
  "nextPieceContainer2",
);
export const musicTriggerBtn = document.getElementById("musicTriggerBtn");
export const soundTriggerBtn = document.getElementById("soundTriggerBtn");
export const gameOverSound = new Audio("./audio/gameOver.mp3");
export const newHighScoreSound = new Audio("./audio/newHighScore.mp3");
export const floorDropSound = new Audio("./audio/hardDrop.mp3");
export const mainLoopMusic = new Audio("./audio/mainLoopMusic.mp3");
export const pauseSound = new Audio("./audio/pauseSound.mp3");
export const pieceRotate = new Audio("./audio/pieceRotate.mp3");
export const rowCleared = new Audio("./audio/rowCleared.mp3");

mainLoopMusic.loop = true;
