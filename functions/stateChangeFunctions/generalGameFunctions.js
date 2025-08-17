// This module contains the centralised logic of the game

// The module imported below contains the game's state variables
import stateVar from "../../globalVariables/stateVars.js";
// The module imported below contains the general functions that can be used anywhere
import * as genFunc from "../generalFunctions.js";
// The module imported below contains functions that perform calculations based on the state of the game
import * as stateEnquiry from "../stateEnquiry.js";
// The module imported below contains functions that add bricks
import * as addBricks from "./addBrickFunctions.js";
// The module imported below contains functions that clears bricks
import * as clearBricks from "./clearBrickFunctions.js";
// The module imported below contains functions that move bricks linearly
import * as moveBricks from "./moveBricks.js";
// The module imported below contains functions that rotate bricks
import * as rotateBricks from "./rotateBricks.js";
// The module imported below contains functions that update the main game logic
import * as stateFunc from "./stateChangeFunctions.js";

export function pauseGame() {
  stateFunc.pauseGameFunction();
}

export function resetCurrentArrays() {
  stateFunc.resetCurrentArraysFunction(
    clearBricks.clearFloatingBricks,
    clearBricks.clearFloorGuideBricks,
  );
}

function handleEndGame(classListToAdd) {
  stateFunc.handleEndGameFunction(classListToAdd);
}

export function buttonClickValidation(movefunction) {
  stateFunc.buttonClickValidationFunction(movefunction);
}

export function updateCurrentUserArray() {
  stateFunc.updateCurrentUserArrayFunction(stateEnquiry.findFloor);
}

function setBoardDimensions(cols, rows, speed, swap) {
  stateFunc.setBoardDimensionsFunction(cols, rows, speed, swap);
}

export function selectNextPiece() {
  stateFunc.selectNextPieceFunction(
    addBricks.fillSevenBag,
    addBricks.nextMatrixSet,
  );
}

function generateTetrisPiece(pieceMatrix, checknotation) {
  addBricks.generateTetrisPieceFunction(
    pieceMatrix,
    checknotation,
    resetCurrentArrays,
    genFunc.trimAllMatrixSides,
    stateEnquiry.getAvailableColumns,
    updateCurrentUserArray,
    // eslint-disable-next-line no-use-before-define
    generateUnblockedPiece,
  );
}

function generateParticularPiece(pieceMatrix, checknotation) {
  addBricks.particularPieceGenerateFunction(
    generateTetrisPiece,
    pieceMatrix,
    checknotation,
  );
}

export function generateFirstPiece() {
  stateFunc.generateFirstPieceFunction(
    addBricks.fillSevenBag,
    generateParticularPiece,
  );
}

export function generateNextPiece() {
  generateParticularPiece(stateVar.nextPieceMatrix, undefined);
}

export async function generateUnblockedPiece() {
  addBricks.generateUnblockedPieceFunction(
    handleEndGame,
    generateParticularPiece,
  );
}

export function movePieceRight() {
  moveBricks.movePieceRightFunction(
    updateCurrentUserArray,
    clearBricks.clearFloatingBricks,
    clearBricks.clearFloorGuideBricks,
    addBricks.addFloatingBricks,
    addBricks.addFloorGuideBricks,
  );
}

export function movePieceLeft() {
  moveBricks.movePieceLeftFunction(
    updateCurrentUserArray,
    clearBricks.clearFloatingBricks,
    clearBricks.clearFloorGuideBricks,
    addBricks.addFloatingBricks,
    addBricks.addFloorGuideBricks,
  );
}

export function instaDrop() {
  moveBricks.instaDropFunction(
    updateCurrentUserArray,
    stateEnquiry.findFloor,
    clearBricks.clearFloatingBricks,
    clearBricks.clearFloorGuideBricks,
    addBricks.addFlooredBricks,
  );
  // eslint-disable-next-line no-use-before-define
  brickHitBottomLogic();
}

export function movePieceDown() {
  moveBricks.movePieceDownFunction(
    updateCurrentUserArray,
    clearBricks.clearFloatingBricks,
    clearBricks.clearFloorGuideBricks,
    stateEnquiry.checkFloor,
    addBricks.addFloatingBricks,
    addBricks.addFloorGuideBricks,
    addBricks.addFlooredBricks,
    // eslint-disable-next-line no-use-before-define
    brickHitBottomLogic,
  );
}

export function unPauseGame() {
  stateFunc.unPauseGameFunction(movePieceDown);
}

export function handleGameUnPause() {
  stateFunc.handleGameUnPauseFunction(unPauseGame);
}

export function startGame() {
  stateFunc.startGameFunction(
    addBricks.generateGridCells,
    resetCurrentArrays,
    generateFirstPiece,
    selectNextPiece,
    addBricks.updateNextPieceIndicator,
    movePieceDown,
  );
}

export function handleUsersettings(e) {
  stateFunc.handleUsersettingsFunction(e, setBoardDimensions, startGame);
}

export function handleSettingsConfirm() {
  stateFunc.handleSettingsConfirmFunction(setBoardDimensions, startGame);
}

export function rotatePieceClockwise() {
  rotateBricks.rotatePieceClockwiseFunction(
    updateCurrentUserArray,
    clearBricks.clearFloatingBricks,
    clearBricks.clearFloorGuideBricks,
    addBricks.addFloatingBricks,
    addBricks.addFloorGuideBricks,
  );
}

export function rotatePieceAntiClockwise() {
  rotateBricks.rotatePieceAntiClockwiseFunction(
    updateCurrentUserArray,
    clearBricks.clearFloatingBricks,
    clearBricks.clearFloorGuideBricks,
    addBricks.addFloatingBricks,
    addBricks.addFloorGuideBricks,
  );
}

export function handleKeyPress(e) {
  stateFunc.handleKeyPressFunction(
    e,
    movePieceLeft,
    movePieceRight,
    movePieceDown,
    instaDrop,
    rotatePieceClockwise,
    rotatePieceAntiClockwise,
  );
}

function nextPieceLogic() {
  resetCurrentArrays();
  generateNextPiece();
  selectNextPiece();
  addBricks.updateNextPieceIndicator();
}

export async function brickHitBottomLogic() {
  stateFunc.brickHitBottomLogicFunction(
    stateEnquiry.getRowsOfBricked,
    handleEndGame,
    stateEnquiry.getFullRowsArray,
    pauseGame,
    clearBricks.clearFullRows,
    clearBricks.shiftBricks,
    nextPieceLogic,
    unPauseGame,
  );
}
