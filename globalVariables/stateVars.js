// This module is for storing all the state variables used in the project

export default {
  // The game over condition is reached when the tetris pieces have hit the top of the board
  gameOver: true,
  // The game is paused when the start game is clicked again (and the settings modal is displayed again)
  paused: false,
  // The board width that would be assigned in pixels
  BOARD_WIDTH: 300,
  // The width in pixel of the next piece indicator
  nextPieceIndicatorWidth: 50,
  // The noOfCols is updated based on the value input from the user and is used to generate the game board
  noOfCols: 0,
  // The noOfRows is updated based on the value input from the user and is used to generate the game board
  noOfRows: 0,
  // Board size is the total number of grid cells (no of rows * no of cols)
  boardSize: 0,
  // The users can also enter a valid game speed
  gameSpeed: 0,
  // The validSettings is used to validate whether an allowed combination of rows, cols and speed has been entered
  validSettings: false,
  // The speed in ms of the piece falling down
  pieceDownInterval: 0,
  // This variable will be used to track the top left-most grid cell of a tetris piece relative to the main game board grid
  currentUserRefCellIndex: 0,
  // The score is the number of lines cleared in a game
  score: 0,
  // The high scores are stored in local storage and later re-used, for different combinations of rows, cols and speed values entered by the user
  highScore: 0,
  // The below four variables are used to track the movements for touch screens (and mouse drags)
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  // Used to specify whether to swap space bar and up key for rotate and insta drop
  swapSpaceBar: false,
  // currentlySelectedPieceMatrix is used to copy the contents from the corresponding matrix for a piece from tetrisPieces.js
  currentlySelectedPieceMatrix: [],
  // currentUserArray is used to store the indices of the cells of the current user controlled tetris piece on the generated board
  currentUserArray: [],
  // floorGuideArray is used to indicate the corresponding position of where the user's tetris piece will land
  floorGuideArray: [],
  // cellsArr is used to store the HTML DOM of the generated grid cells from the board
  cellsArr: [],
  // These are the tetris pieces that are used in the game
  pieces: ["O", "I", "J", "L", "S", "Z", "T"],
  // The seven bag sytem is implemented to provide a better experience for the players
  sevenBag: [],
  // nextPieceMatrix is used to grab and store the shape definition of the next tetris piece that is going to be generated
  nextPieceMatrix: [],
  // After the pieces have stacked to a particular height, if there is no space for a particular piece to spawn, it is added to the array below
  blockedPieces: [],
};
