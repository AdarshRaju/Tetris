// This module contains general functions that can be used independently of game state or other custom functions

// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../globalVariables/docElems.js";


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

export function getDepthMap(pieceMatrix){
    
    let lastRow = pieceMatrix.length - 1;
    let lastRowItems = pieceMatrix[lastRow];
    let lastRowMap = lastRowItems.map(cell => cell ? 1 : 0);

    // For potential future features where a piece matrix could have multiple false only rows at the bottom
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

export function preLoadSoundFile(soundVariable){
    soundVariable.preload = "auto";
    soundVariable.load();
};

// #region logic for the settings selection modal
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
// #endregion logic for the settings selection modal
