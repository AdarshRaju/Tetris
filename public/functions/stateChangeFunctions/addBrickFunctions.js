// The module imported below contains the game's state variables
import stateVar from "../../globalVariables/stateVars.js";
// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains the various tetris pieces used in the game
import * as tetrisPieces from "../../globalVariables/tetrisPieces.js";

export function addFloatingBricks(indexno) {
  stateVar.cellsArr[indexno].classList.add("floatingBrick");
}

export function addFlooredBricks(indexno) {
  stateVar.cellsArr[indexno].classList.add("flooredBrick");
}

export function addFloorGuideBricks(indexno) {
  stateVar.cellsArr[indexno].classList.add("floorCheckBrick");
}

export function generateGridCells() {
  for (let i = 0; i < stateVar.boardSize; i += 1) {
    const newGridElement = document.createElement("div");
    newGridElement.classList.add("gridItem");
    newGridElement.id = i;
    docElems.mainGridContainer.appendChild(newGridElement);
  }

  const cellWidth = stateVar.boardWidth / stateVar.noOfCols;
  const boardHeight =
    stateVar.boardWidth + cellWidth * (stateVar.noOfRows - stateVar.noOfCols);
  const docStyle = document.createElement("style");
  docStyle.textContent = `
        #mainGridContainer {
            grid-template: repeat(${stateVar.noOfRows}, 1fr) / repeat(${
              stateVar.noOfCols
            }, 1fr) ;
            border: transparent solid 5px;
            border-image: linear-gradient(to top, black, rgb(93, 45, 45));
            border-image-slice: 1;
        }
        @media (max-width: 600px) {
            #mainGridContainer{
                width: ${stateVar.boardWidth / 2}px;
                height: ${boardHeight / 2}px;
            }
        }
        @media (min-width: 601px) {
            #mainGridContainer{
               width: ${stateVar.boardWidth}px;
                height: ${boardHeight}px;
            }

        }   

    `;

  document.head.appendChild(docStyle);

  stateVar.cellsArr = [...document.getElementsByClassName("gridItem")];
}

export function updateNextPieceIndicator() {
  // This logic is inclusive of accepting custom tetris pieces of different dimensions introduced in the future
  docElems.nextPieceContainer1.innerHTML = "";
  const maxDimension =
    stateVar.nextPieceMatrix.length > stateVar.nextPieceMatrix[0].length
      ? stateVar.nextPieceMatrix.length
      : stateVar.nextPieceMatrix[0].length;
  const pieceMatrixWidth = stateVar.nextPieceMatrix[0].length;
  const flatarray = stateVar.nextPieceMatrix.flat();
  // The next piece indicator container will always be a square shape
  const pieceIndicatorSize = maxDimension * maxDimension;

  // When the pieceMatrixWidth is the maxDimension, we can just add the cells in order from the piece matrix
  if (pieceMatrixWidth === maxDimension) {
    for (let i = 0; i < pieceIndicatorSize; i += 1) {
      const newGridElement = document.createElement("div");
      if (i < flatarray.length) {
        if (flatarray[i]) {
          newGridElement.classList.add("nextBrick");
        } else {
          newGridElement.classList.add("nextPieceGridItem");
        }
      } else {
        newGridElement.classList.add("nextPieceGridItem");
      }
      docElems.nextPieceContainer1.appendChild(newGridElement);
    }
  } else {
    let localCounter = 0;
    for (let i = 0; i < pieceIndicatorSize; i += 1) {
      const newGridElement = document.createElement("div");
      // In this case, the piece height will be the maxDimension

      if (i % maxDimension < pieceMatrixWidth) {
        if (flatarray[localCounter]) {
          newGridElement.classList.add("nextBrick");
        } else {
          newGridElement.classList.add("nextPieceGridItem");
        }
        localCounter += 1;
      } else {
        newGridElement.classList.add("nextPieceGridItem");
      }
      docElems.nextPieceContainer1.appendChild(newGridElement);
    }
  }

  const docStyle = document.createElement("style");
  docStyle.textContent = `
    
        #nextPieceContainer1 {
            grid-template: repeat(${maxDimension}, 1fr) / repeat(${maxDimension}, 1fr);
            border: transparent solid 3px;
            border-image: linear-gradient(to top, black, rgb(93, 45, 45));
            border-image-slice: 1;
        }
        @media (max-width: 600px) {
            #nextPieceContainer1, #nextPieceContainer2{
                width: ${stateVar.nextPieceIndicatorWidth / 2}px;
                height: ${stateVar.nextPieceIndicatorWidth / 2}px;
                margin-bottom: 5px;
            }
        }
        @media (min-width: 601px) {
            #nextPieceContainer1, #nextPieceContainer2{
               width: ${stateVar.nextPieceIndicatorWidth}px;
                height: ${stateVar.nextPieceIndicatorWidth}px;
                margin-bottom: 10px;
            }

        }   

    `;
  document.head.appendChild(docStyle);
}

export function generateTetrisPieceFunction(
  pieceMatrix,
  checknotation,
  resetCurrentArrays,
  trimAllMatrixSides,
  getAvailableColumns,
  updateCurrentUserArray,
  generateUnblockedPiece,
) {
  resetCurrentArrays();

  const trimmedMatrix = trimAllMatrixSides(pieceMatrix);

  // always generate the item from the top-left corner of the piece matrix grid

  const availableCols = getAvailableColumns(trimmedMatrix);

  if (availableCols.length > 0) {
    stateVar.currentUserRefCellIndex =
      availableCols[Math.floor(Math.random() * availableCols.length)];
    stateVar.currentlySelectedPieceMatrix = trimmedMatrix;
    updateCurrentUserArray();
    stateVar.currentUserArray.forEach(addFloatingBricks);
    stateVar.floorGuideArray.forEach(addFloorGuideBricks);
  } else {
    stateVar.blockedPieces.push(checknotation);
    // eslint-disable-next-line no-use-before-define
    generateUnblockedPiece();
  }
}

export function nextMatrixSet(piecenotation) {
  switch (piecenotation) {
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

// Either the piece matrix or the piece notation can be used to generate a piece
export function particularPieceGenerateFunction(
  generateTetrisPiece,
  pieceMatrix,
  checknotation,
) {
  let assignedMatrix;
  let assignedNotation;

  switch (checknotation) {
    case "O":
      assignedMatrix = tetrisPieces.OPieceMatrix;
      break;

    case "I":
      assignedMatrix = tetrisPieces.IPieceMatrix;
      break;

    case "J":
      assignedMatrix = tetrisPieces.JPieceMatrix;
      break;

    case "L":
      assignedMatrix = tetrisPieces.LPieceMatrix;
      break;

    case "S":
      assignedMatrix = tetrisPieces.SPieceMatrix;
      break;

    case "Z":
      assignedMatrix = tetrisPieces.ZPieceMatrix;
      break;

    case "T":
      assignedMatrix = tetrisPieces.TPieceMatrix;
      break;
    default:
  }

  switch (pieceMatrix) {
    case tetrisPieces.OPieceMatrix:
      assignedNotation = "O";
      break;

    case tetrisPieces.IPieceMatrix:
      assignedNotation = "I";
      break;

    case tetrisPieces.JPieceMatrix:
      assignedNotation = "J";
      break;

    case tetrisPieces.LPieceMatrix:
      assignedNotation = "L";
      break;

    case tetrisPieces.SPieceMatrix:
      assignedNotation = "S";
      break;

    case tetrisPieces.ZPieceMatrix:
      assignedNotation = "Z";
      break;

    case tetrisPieces.TPieceMatrix:
      assignedNotation = "T";
      break;
    default:
  }
  if (checknotation) {
    generateTetrisPiece(assignedMatrix, checknotation);
  } else if (pieceMatrix) {
    generateTetrisPiece(pieceMatrix, assignedNotation);
  }
}
