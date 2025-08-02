// These contain the HTML DOM elements grabbed from the main index.html file
import * as docElems from "../globalVariables/docElems.js";
// These contain the game's state variables
import {genVar} from "../globalVariables/generalVars.js";

// #region logic for touchscreens

export function setUpTouchControls(){
    docElems.mainGridContainer.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

    var leftKeyEvent = new KeyboardEvent("keydown", {
        key: "ArrowLeft"
    });

    var rightKeyEvent = new KeyboardEvent("keydown", {
        key: "ArrowRight"
    });

    var upKeyEvent = new KeyboardEvent("keydown", {
        key: "ArrowUp"
    });

    var downKeyEvent = new KeyboardEvent("keydown", {
        key: "ArrowDown"
    });


    docElems.mainGridContainer.addEventListener("dragstart", e => e.preventDefault());

    docElems.mainGridContainer.addEventListener("mousedown", (e) =>{
        genVar.startX = e.clientX;
        genVar.startY = e.clientY;
        // console.log("genVar.startX and genVar.startY is: ", genVar.startX, genVar.startY);
    });

    docElems.mainGridContainer.addEventListener("mouseup", (e) =>{
        genVar.endX = e.clientX;
        genVar.endY = e.clientY;
        // console.log("genVar.endX and genVar.endY is: ", genVar.endX, genVar.endY);
        handleGesture();

    });

    docElems.mainGridContainer.addEventListener("touchstart", (e) =>{
        genVar.startX = e.touches[0].clientX;
        genVar.startY = e.touches[0].clientY;
    });

    docElems.mainGridContainer.addEventListener("touchend", (e) =>{

        genVar.endX = e.changedTouches[0].clientX;
        genVar.endY = e.changedTouches[0].clientY;

        handleGesture();
    });

    function handleGesture() {
        const deltaX = genVar.endX - genVar.startX;
        const deltaY = genVar.endY - genVar.startY;
        
        let regX = false;
        let regY = false;
        
        (Math.abs(deltaX) > Math.abs(deltaY) ) ? regX = true : regY = true;
        
        if (Math.abs(deltaX) > 50 && regX) {
            if (deltaX > 0) {
                // console.log("right swipe was activated.");
                document.dispatchEvent(rightKeyEvent);
            } else {
                // console.log("left swipe was activated.");
                document.dispatchEvent(leftKeyEvent);
            }
        }
        

        if (Math.abs(deltaY) > 50 && regY) {
            if (deltaY > 0) {
                // console.log("swipe down was activated.");
                document.dispatchEvent(downKeyEvent);
            } else {
                // console.log("swipe up was activated.");
                document.dispatchEvent(upKeyEvent);
            }
        }
    };
};

// #endregion logic for touchscreens