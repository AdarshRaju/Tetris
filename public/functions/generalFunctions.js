// This module contains general functions that can be used independently of game state or other custom functions

// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../globalVariables/docElems.js";

// #region general matrix rotate functions
export function rotateMatrixClockwise(mat){
    let tempMatrix = [];
    for (let i=0; i<mat[0].length; i++){
        let tempArr = [];
        for (let j=(mat.length-1); j>=0; j--){
                tempArr.push(mat[j][i])
        }
        tempMatrix.push(tempArr);
    };
    return tempMatrix;
};

export function rotateMatrixAntiClockwise(mat){
    let tempMatrix = [];
    
    for (let i=(mat[0].length - 1); i>=0; i--){
        let tempArr = [];
        for (let j=0; j<mat.length; j++){
                tempArr.push(mat[j][i])
        }
        tempMatrix.push(tempArr);
    };
    return tempMatrix;
};
// #endregion general matrix rotate functions

// #region function for trimming a piecematrix for "false" only rows and columns at the ends
export function trimMatrixBottom(pieceMatrix){
    let lastRealRow = pieceMatrix.length - 1;
    let lastRealRowItems = pieceMatrix[lastRealRow];

    // For potential future features where a custom piece matrix could have multiple false only rows at the bottom
    while (!lastRealRowItems.includes(true) && lastRealRow >=0){
        lastRealRow--;
        lastRealRowItems = pieceMatrix[lastRealRow];
    }
    return pieceMatrix.slice(0,lastRealRow+1);
};

export function trimMatrixTop(pieceMatrix){
    let firstRealRow = 0;
    let firstRealRowItems = pieceMatrix[firstRealRow];

    // For potential future features where a custom piece matrix could have multiple false only rows at the top
    while (!firstRealRowItems.includes(true) && firstRealRow < pieceMatrix.length){
        firstRealRow++;
        firstRealRowItems = pieceMatrix[firstRealRow];
    }
    return pieceMatrix.slice(firstRealRow);
};

export function trimMatrixRight(pieceMatrix){
    let lastRealCol = pieceMatrix[0].length -1;

    // For potential future features where a custom piece matrix could have multiple false only columns at the right

    // going from right to left on outer loop and top to bottom on inner loop
    for(let i=lastRealCol; i>=0;i--){
        let localFalseCounter=0;
        for (let j=0; j<pieceMatrix.length; j++){
            if (!pieceMatrix[j][i]){
                localFalseCounter++;
            }
        }
        if (!(localFalseCounter === pieceMatrix.length)){
            
            lastRealCol = i;
            break;
        }
    };
    let rightSlicedMatrix = pieceMatrix.map(row =>{
        return row.slice(0,lastRealCol+1);
    });

    return rightSlicedMatrix;
};

export function trimMatrixLeft(pieceMatrix){
    let firstRealCol = 0;

    // For potential future features where a custom piece matrix could have multiple false only columns at the left

    for(let i=firstRealCol; i<pieceMatrix[0].length;i++){
        let localFalseCounter=0;
        for (let j=0; j<pieceMatrix.length; j++){
            if (!pieceMatrix[j][i]){
                localFalseCounter++;
            }
        }
        if (!(localFalseCounter === pieceMatrix.length)){
            firstRealCol = i;
            break;
        }
    };
    let leftSlicedMatrix = pieceMatrix.map(row =>{
        return row.slice(firstRealCol);
    });

    return leftSlicedMatrix;
};

export function trimAllMatrixSides(pieceMatrix){
    return trimMatrixBottom(trimMatrixTop(trimMatrixRight(trimMatrixLeft(pieceMatrix))));
}

// #endregion function for trimming a piecematrix for "false" only rows and columns at the ends

// #region function for getting the heights of columns of a tetris piece matrix till the first "false" only rows
export function getDepthMap(pieceMatrix){
    
    let lastRow = pieceMatrix.length - 1;
    let lastRowItems = pieceMatrix[lastRow];
    let lastRowMap = lastRowItems.map(cell => cell ? 1 : 0);

    // For potential future features where a custom piece matrix could have multiple false only rows at the bottom
    while (!lastRowMap.includes(1) && lastRow >=0){
        lastRow--;
        lastRowItems = pieceMatrix[lastRow];
        lastRowMap = lastRowItems.map(cell => cell ? 1 : 0);
    }

    let relativeRowHeightMap = lastRowMap.map((lastRowItem, itemIndex) =>{
        if (!lastRowItem) {
            
            for (let i=(lastRow -1); i>=0; i--){
                if (!pieceMatrix[i][itemIndex]){
                    lastRowItem--;
                } else {break;}
            }
        }
        return lastRowItem-1;
    });

    // Piece height after the height of the false only rows are trimmed out from the bottom of the pieceMatrix
    let pieceHeight1 = lastRow +1;
    let depthMap = relativeRowHeightMap.map(col =>{
        return col + pieceHeight1;
    });
    return depthMap
};

// #endregion function for getting the heights of columns of a tetris piece matrix till the first "false" only rows

// #region logic for the settings selection in bootstrap modal
export function toggleCustomDisplay(event,customInput, customLabel, customFeedback){
    
    if(event.target.value == "custom"){

        customInput.removeAttribute("hidden");
        customInput.removeAttribute("disabled");
        customInput.removeAttribute("required");
        customLabel.removeAttribute("hidden");        
        customFeedback.hidden = false;
    }else {

        customInput.setAttribute("hidden", "true");
        customInput.setAttribute("disabled", "true");
        customInput.setAttribute("required", "true");
        customLabel.setAttribute("hidden", "true");        
        customFeedback.hidden = true;
    }
}

export function toggleInvalidFeedback(inputBox, feedbackBox){
    let check;
    let checkInputBox = parseInt(inputBox.value);
    if (inputBox == docElems.customColsSel){
        check = (!inputBox.value || checkInputBox <5 || checkInputBox >50)
    } else if (inputBox == docElems.customRowsSel){
        check = (!inputBox.value || checkInputBox <10 || checkInputBox >100)
    } else if (inputBox == docElems.customSpeedSel){
        check = (!inputBox.value || checkInputBox <25 || checkInputBox >5000)
    }

    if (check){
        inputBox.classList.add("is-invalid");
        inputBox.classList.remove("is-valid");
        feedbackBox.classList.add("invalid-feedback");
        feedbackBox.hidden = false;
    } else {
        inputBox.classList.add("is-valid");
        inputBox.classList.remove("is-invalid")
        feedbackBox.classList.remove("invalid-feedback");
        feedbackBox.hidden = true;
    }
};

export function checkBoardHeight(boardHeight){
    return (boardHeight > window.innerHeight);
};

// #endregion logic for the settings selection in bootstrap modal

// #region logic for sound and music volume

export function toggleMusic(e){
    if (e.target.classList.contains("bi-file-music-fill")){
        e.target.classList.remove("bi-file-music-fill");
        e.target.classList.add("bi-file-music");
        docElems.mainLoopMusic.muted = true;
    } else {
        e.target.classList.remove("bi-file-music");
        e.target.classList.add("bi-file-music-fill");
        docElems.mainLoopMusic.muted = false;
    }
};

export function toggleSounds(e){
    if (e.target.classList.contains("bi-volume-down-fill")){
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
};

export function preLoadSoundFile(soundVariable){
    soundVariable.preload = "auto";
    soundVariable.load();
};

// #endregion logic for sound and music volume