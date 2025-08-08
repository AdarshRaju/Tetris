// The module imported below contains the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../../globalVariables/docElems.js";
// The module imported below contains the game's state variables
import {stateVar} from "../../globalVariables/stateVars.js";

export function clearFullRows(fullRowsArr){
    
        docElems.rowCleared.currentTime=0;
        docElems.rowCleared.play();
        fullRowsArr.forEach(fullRow =>{
            let startingInd = parseInt(fullRow) * stateVar.noOfCols;
            let finishingInd = startingInd + (stateVar.noOfCols-1);

            for (let i=startingInd; i <= finishingInd; i++){
                stateVar.cellsArr[i].classList.remove("flooredBrick");
            };
            stateVar.score++;
            docElems.scoreValue.innerHTML = stateVar.score;
            if(stateVar.score>stateVar.highScore){
                stateVar.highScore = stateVar.score;
                localStorage.setItem("highScore", stateVar.highScore);
            };
            docElems.highScoreValue.innerHTML = stateVar.highScore;
        });
    
};


function handleClassClearing(stateArray, removeClassName){

    let nonexistentindex=false;
    stateArray.forEach(index =>{
        if(stateVar.cellsArr[index]){
            stateVar.cellsArr[index].classList.remove(removeClassName);
        } else {
            nonexistentindex=true;
        };
    });
    if(nonexistentindex){
        stateVar.cellsArr.forEach(cell =>{
            cell.classList.remove(removeClassName);
        })
    };

};

export function clearFloatingBricks(){

    handleClassClearing(stateVar.currentUserArray, "floatingBrick")
};

export function clearFloorGuideBricks(){

    handleClassClearing(stateVar.floorGuideArray, "floorCheckBrick")
};