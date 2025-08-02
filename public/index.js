// #region HTML elements captured and stored in variables

var mainGridContainer = document.getElementById("mainGridContainer");
var startButton = document.getElementById("startButton");
var acceptSettingsBtn = document.getElementById("acceptSettingsBtn");
var statusHeading = document.getElementById("statusHeading");
var scoreBar = document.getElementById("scoreBar");
var scoreValue = document.getElementById("scoreValue");
var rotateAntiClockwiseBtn = document.getElementById("rotateAntiClockwiseBtn");
var moveLeftBtn = document.getElementById("moveLeftBtn");
var rotateClockwiseBtn = document.getElementById("rotateClockwiseBtn");
var moveRightBtn = document.getElementById("moveRightBtn");
var moveDownBtn1 = document.getElementById("moveDownBtn1");
var moveDownBtn2 = document.getElementById("moveDownBtn2");
var instaDownBtn1 = document.getElementById("instaDownBtn1");
var instaDownBtn2 = document.getElementById("instaDownBtn2");
var startGameModal = document.getElementById("startGameModal");
var noOfColsSel = document.getElementById("noOfColsSel");
var noOfRowsSel = document.getElementById("noOfRowsSel");
var gameSpeedSel = document.getElementById("gameSpeedSel");
var customColsSel = document.getElementById("customColsSel");
var customRowsSel = document.getElementById("customRowsSel");
var customSpeedSel = document.getElementById("customSpeedSel");
var labelCustomColsSel = document.getElementById("labelCustomColsSel");
var labelCustomRowsSel = document.getElementById("labelCustomRowsSel");
var labelCustomSpeedSel = document.getElementById("labelCustomSpeedSel");
var form = document.getElementById("form");
var modal = new bootstrap.Modal('#startGameModal');
var customColInvalidFeedback = document.getElementById("customColInvalidFeedback");
var customRowInvalidFeedback = document.getElementById("customRowInvalidFeedback");
var customSpeedInvalidFeedback = document.getElementById("customSpeedInvalidFeedback");

// #endregion HTML elements captured and stored in variables

// #region global variables set
var gameOver=true;
var paused;
var modalClosedBySubmit;
var boardWidth = 300;
var noOfCols;
var noOfRows;
var boardSize;
var gameSpeed;
var currentlySelectedPiece;
var currentlySelectedPieceMatrix = [];
var pieceDownInterval;
var clickDownInterval;
var currentUserRefCellIndex;
var score = 0;


var currentUserArray = [];
var floorShiftArray = [];
var cellsArr = [];
var pieces = ["O", "I", "J", "L", "S", "Z", "T"];
var blockedPieces = [];

let testMatrix = [
    [true, true, true],
    [true, true, false],
    [true, true, false],
    [false, true, false],
    [false, false, false],
    [false, false, false],
];

let OPieceMatrix = [
        [true, true],
        [true, true]    
    ];

let IPieceMatrix = [
        [true],
        [true],
        [true],
        [true]       
    ];

let JPieceMatrix = [
        [false, true],
        [false, true],
        [true, true]       
    ];

let LPieceMatrix = [
        [true, false],
        [true, false],
        [true, true]       
    ];

let SPieceMatrix = [
        [false, true, true],
        [true, true, false]     
    ];

let ZPieceMatrix = [
        [true, true, false],
        [false, true, true]     
    ];

 let TPieceMatrix = [
        [true, true, true],
        [false, true, false]  
    ];

// #endregion global variables set

// #region logic for touchscreens

mainGridContainer.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

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


mainGridContainer.addEventListener("dragstart", e => e.preventDefault());

mainGridContainer.addEventListener("mousedown", (e) =>{
    startX = e.clientX;
    startY = e.clientY;
    // console.log("startx and starty is: ", startX, startY);
});

mainGridContainer.addEventListener("mouseup", (e) =>{
    endX = e.clientX;
    endY = e.clientY;
    // console.log("endX and endY is: ", endX, endY);
    handleGesture();

});

mainGridContainer.addEventListener("touchstart", (e) =>{
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

mainGridContainer.addEventListener("touchend", (e) =>{

    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;

    handleGesture();
});

function handleGesture() {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
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

// #endregion logic for touchscreens

// #region logic for the settings selection modal


function toggleCustomDisplay(event,customInput, customLabel, customFeedback){
    
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

noOfColsSel.addEventListener("change", (e) =>{
    
    toggleCustomDisplay(e, customColsSel, labelCustomColsSel, customColInvalidFeedback);

});

noOfRowsSel.addEventListener("change", (e) =>{
    
    toggleCustomDisplay(e, customRowsSel, labelCustomRowsSel, customRowInvalidFeedback);
});

gameSpeedSel.addEventListener("change", (e) =>{
   
    toggleCustomDisplay(e, customSpeedSel, labelCustomSpeedSel, customSpeedInvalidFeedback);
});


function toggleInvalidFeedback(inputBox, feedbackBox){
    let check;
    let checkInputBox = parseInt(inputBox.value);
    if (inputBox == customColsSel){
        check = (!inputBox.value || checkInputBox <5 || checkInputBox >50)
    } else if (inputBox == customRowsSel){
        check = (!inputBox.value || checkInputBox <10 || checkInputBox >100)
    } else if (inputBox == customSpeedSel){
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

}

customColsSel.addEventListener("change", ()=>{
    if (!customColsSel.disabled){

        toggleInvalidFeedback(customColsSel, customColInvalidFeedback);
    }
});

customRowsSel.addEventListener("change", ()=>{
    if (!customRowsSel.disabled){
  
        toggleInvalidFeedback(customRowsSel, customRowInvalidFeedback);
    }
});

customSpeedSel.addEventListener("change", ()=>{
    if (!customSpeedSel.disabled){

        toggleInvalidFeedback(customSpeedSel, customSpeedInvalidFeedback);
    }
});

// #endregion logic for the settings selection modal


function rotateMatrixClockwise(mat){
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

function rotateMatrixAntiClockwise(mat){
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

// #region game start functions
// Preserves browser form value validation for use in bootstrap
form.addEventListener("submit", (e) =>{
    'use strict'
    
    e.preventDefault();

    let valid=true;
    let checkCustomCol;
    let checkCustomRow;
    let checkCustomSpeed;
    
    // customColsSel.setCustomValidity("");
    // customRowsSel.setCustomValidity("");
    // customSpeedSel.setCustomValidity("");
    customColInvalidFeedback.classList.remove("invalid-feedback");
    customRowInvalidFeedback.classList.remove("invalid-feedback");
    customSpeedInvalidFeedback.classList.remove("invalid-feedback");

    if(noOfColsSel.value == "custom"){
        checkCustomCol = parseInt(customColsSel.value);
        if(!customColsSel.value || checkCustomCol <5 || checkCustomCol >50){
            valid = false;
            customColsSel.classList.add("is-invalid");
            customColInvalidFeedback.classList.add("invalid-feedback");
            customColInvalidFeedback.hidden = false;
        } else {
            customColsSel.classList.add("is-valid");
            customColInvalidFeedback.classList.remove("invalid-feedback");
            customColInvalidFeedback.hidden = true;
            noOfCols = checkCustomCol;
        }

        // customColsSel.setAttribute("required", "true");
    } else{
        noOfCols = parseInt(noOfColsSel.value);
        // customColsSel.removeAttribute("required");
    };



    if (noOfRowsSel.value  == "custom"){
        checkCustomRow = parseInt(customRowsSel.value);
        if(!customRowsSel.value || checkCustomRow <10 || checkCustomRow >100){
            valid = false;
            customRowsSel.classList.add("is-invalid");
            customRowInvalidFeedback.classList.add("invalid-feedback");
            customRowInvalidFeedback.hidden = false;
        } else {
            customRowsSel.classList.add("is-valid");
            customRowInvalidFeedback.classList.remove("invalid-feedback");
            customRowInvalidFeedback.hidden = true;
            noOfRows = checkCustomRow;
        }
        // customRowsSel.setAttribute("required", "true");
    } 
    
    else{
        noOfRows = parseInt(noOfRowsSel.value);
        // customRowsSel.removeAttribute("required");
    };

    
    if (gameSpeedSel.value  == "custom"){
        checkCustomSpeed = parseInt(customSpeedSel.value);
        if(!customSpeedSel.value || checkCustomSpeed <25 || checkCustomSpeed >5000){
            valid = false;
            customSpeedSel.classList.add("is-invalid");
            customSpeedInvalidFeedback.classList.add("invalid-feedback");
            customSpeedInvalidFeedback.hidden = false;
        } else {
            customSpeedSel.classList.add("is-valid");
            customSpeedInvalidFeedback.classList.remove("invalid-feedback");
            customSpeedInvalidFeedback.hidden = true;
            gameSpeed = checkCustomSpeed;
        }
        // customSpeedSel.setAttribute("required", "true");
    } else{
        gameSpeed = parseInt(gameSpeedSel.value);
       
    };

   
    if (valid == false){
        return;
    }
    else {
        
        modalClosedBySubmit = true;
        modal.hide();
        startGame();
    }

});

startButton.addEventListener("click", () =>{
    // console.log("start btn was pressed");
    pauseGame();
});

modal._element.addEventListener("hidden.bs.modal", ()=>{
    // console.log("modal hidden was triggered");
    if(modalClosedBySubmit){
        modalClosedBySubmit = false;
    } else {
        unPauseGame();
    }
    
})


function startGame() {
    // if((gameOver)){
        gameOver = false;
        paused = false;
        mainGridContainer.innerHTML = "";
        statusHeading.innerHTML = `Use <i class="bi bi-arrow-left-square"></i> <i class="bi bi-arrow-up-square"></i> <i class="bi bi-arrow-down-square"></i> <i class="bi bi-arrow-right-square"></i> <i class="bi bi-shift"></i> and Space / drag to play`;

        boardSize = noOfRows * noOfCols;
        generateGridCells();
        resetCurrentArrays();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        blockedPieces = [];
        score = 0;
        scoreValue.innerHTML = score;
        generateRandomPiece();
        pieceDownInterval && clearInterval(pieceDownInterval);
        pieceDownInterval = setInterval(movePieceDown, gameSpeed);
        
    // }
};

function pauseGame(){
    if(!paused && !gameOver){
        // console.log("pause game was triggered");
        paused = true;
        clearInterval(pieceDownInterval);
        pieceDownInterval = null;
    }
}

function unPauseGame(){
    if(!gameOver && paused){
        paused = false;
        // console.log("unPauseGame was triggered");
        // console.log("Boolean pieceDownInterval in unpause is: ", Boolean(pieceDownInterval));
        (!pieceDownInterval) && (pieceDownInterval = setInterval(movePieceDown, gameSpeed));
    }
}

function generateGridCells(){

    for (let i=0; i<boardSize; i++){
        let newGridElement = document.createElement("div");
        newGridElement.classList.add("gridItem");
        newGridElement.id = i;
        mainGridContainer.appendChild(newGridElement);
    };

    mainGridContainer.style.gridTemplateColumns = `repeat(${noOfCols}, 1fr)`;
    mainGridContainer.style.gridTemplateRows = `repeat(${noOfRows}, 1fr)`;
    mainGridContainer.style.border= "transparent solid 5px";
    mainGridContainer.style.borderImage= `linear-gradient(to top, black, rgb(93, 45, 45))`;
    mainGridContainer.style.borderImageSlice= "1";

    let cellWidth = boardWidth/noOfCols;
    let boardHeight = boardWidth+(cellWidth*(noOfRows-noOfCols));
    // console.log("boardWidth is: ", boardWidth, "boardHeight is: ", boardHeight);
    
    var docStyle = document.createElement("style");
    docStyle.textContent = `
        @media (max-width: 600px) {
            #mainGridContainer{
                width: ${boardWidth/2}px;
                height: ${boardHeight/2}px;
            }
        }
        @media (min-width: 601px) {
            #mainGridContainer{
               width: ${boardWidth}px;
                height: ${boardHeight}px;
            }

        }   

    `;

    document.head.appendChild(docStyle);
    
    

 
    cellsArr = [...document.getElementsByClassName("gridItem")];
};

// #endregion game start functions

function resetCurrentArrays(){
    
    currentUserRefCellIndex = 0;
    clearFloatingBricks();
    clearFloorShiftBricks();
    currentUserArray = [];
    floorShiftArray = [];
    currentlySelectedPieceMatrix = [];
    
    
};


function clearFloatingBricks(){
    cellsArr.forEach(cell =>{
        cell.classList.remove("floatingBrick");
    })
};

function clearFloorShiftBricks(){
    cellsArr.forEach(cell =>{
        cell.classList.remove("floorCheckBrick");
    })
}

function addFloatingBricks(indexno) {
    cellsArr[indexno].classList.add("floatingBrick");
};

function addFlooredBricks(indexno) {
    cellsArr[indexno].classList.add("flooredBrick");
};

function addFloorShiftBricks(indexno) {
    cellsArr[indexno].classList.add("floorCheckBrick");
};

// #region piece generation logic

function generateUnblockedPiece(){

//    console.log("The blocked pieces are: ", blockedPieces);

    if(blockedPieces.length == pieces.length){
        // console.log("Game Over! None of the pieces can be generated in the grid space.");
        gameOver = true;
        statusHeading.innerHTML = "Game Over! Press start to play again";
        clearInterval(pieceDownInterval);
        pieceDownInterval=null;
    } else {
        for (piece of pieces){
            if (!blockedPieces.includes(piece)){
                switch(piece){
                    case "O":
                        generateOPiece();
                        break;
                    case "I":
                        generateIPiece();
                        break;
                    case "J":
                        generateJPiece();
                        break;
                    case "L":
                        generateLPiece();
                        break;
                    case "S":
                        generateSPiece();
                        break;
                    case "Z":
                        generateZPiece();
                        break;
                    case "T":
                        generateTPiece();
                        break;
                        
                }
                break;
            }
        }
    }

    
};

function checkBricksInColForDepth(colNo,depth){
    let bricksInCol = cellsArr.filter(cell=>{
        return (parseInt(cell.id) < (noOfCols * depth)) && (cell.classList.contains("flooredBrick"))
        && (parseInt(cell.id)%noOfCols == colNo)
    })
    // console.log("bricksInCol is: ", bricksInCol);
    // return bricksInCol.length>0 ? true:false;
    return bricksInCol;
};

function getDepthMap(pieceMatrix){
    
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
}

function getAvailableColumns(pieceMatrix){

    let pieceWidth = pieceMatrix[0].length;

    let depthMap = getDepthMap(pieceMatrix);
    let pieceHeight1 = Math.max(...depthMap);
    // console.log("pieceHeight1 is: ", pieceHeight1);

    let availableCols = [];

    // preliminary depth check for optimization
    let t1 = performance.now();
    let bricksInTheWayHeight1 = cellsArr.filter(cell =>{
        return ((parseInt(cell.id) < (noOfCols * pieceHeight1)) && (cell.classList.contains("flooredBrick")));
    });

    if (bricksInTheWayHeight1.length == 0){
        // console.log("There are no bricks of in the way in the max height of the piece from the top row");
        for (let i=0; i<(noOfCols-pieceWidth+1); i++){
            availableCols.push(i)
        }   
        
        // let t2 = performance.now();
        // console.log("Compute time taken in preliminary check is: ", (t2-t1));
        
    } else {

        for (let i=0; i<(noOfCols-pieceWidth+1);i++){
            let pieceFitCheck = depthMap.map((pieceColDepth, pieceColIndex)=>{
                let brickInCol = checkBricksInColForDepth((i+pieceColIndex), pieceColDepth);
                return brickInCol.length>0 ? true:false;
            });
            if(!pieceFitCheck.includes(true)){
                availableCols.push(i)
            }
        };
        // let t3 = performance.now();
        // console.log("Compute time taken in detailed check is: ", (t3-t1));
    }


    // console.log("pieceHeight1 is: ", pieceHeight1);

    // console.log("lastRowMap is: ", lastRowMap);

    // console.log("depthMap is: ", depthMap);

    // #region legacy code

    // let pieceHeight2;
    // lastRowMap.includes(0) ? pieceHeight2 = (pieceHeight1 -1) : pieceHeight2 = pieceHeight1;

// check for any obstructions from floored bricks that would coincide with the location of the cells in the piece
    // let bricksInTheWayHeight1 = cellsArr.filter(cell =>{
    //     return ((parseInt(cell.id) < (noOfCols * pieceHeight1)) && (cell.classList.contains("flooredBrick")));
    // });

    

    // let colBricksInWayHeight1 = bricksInTheWayHeight1.map(brickCell => parseInt(brickCell.id)%noOfCols);

    // let pieceHeight1EmptyCols = [];
    // let pieceHeight2EmptyCols = [];

    // To check all the available columns for height1 here
    // for (let i=0; i<(noOfCols); i++){
    //     if(!colBricksInWayHeight1.includes(i)){
    //         pieceHeight1EmptyCols.push(i);
    //     }
    // };

    // if(pieceHeight1 !== pieceHeight2){
    //     let bricksInTheWayHeight2 = cellsArr.filter(cell =>{
    //     return ((parseInt(cell.id) < (noOfCols * pieceHeight2)) && (cell.classList.contains("flooredBrick")));
    //     });

    //     let colBricksInWayHeight2 = bricksInTheWayHeight2.map(brickCell => parseInt(brickCell.id)%noOfCols);

        

    //     // To check all the available columns for height2 here
    //     for (let i=0; i<(noOfCols); i++){
    //         if(!colBricksInWayHeight2.includes(i)){
    //             pieceHeight2EmptyCols.push(i);
    //         }
    //     };

    // } else {
    //     // bricksInTheWayHeight2 = bricksInTheWayHeight1;
    //     // colBricksInWayHeight2 = colBricksInWayHeight1;
    //     pieceHeight2EmptyCols = pieceHeight1EmptyCols;

    // }

    //  console.log("pieceHeight1EmptyCols is: ", pieceHeight1EmptyCols, "pieceHeight2EmptyCols is: ", pieceHeight2EmptyCols);

    // This is the final available columns list for the selected piece type
    


   
    // if (piece == "O" || piece == "I" || piece == "J" || piece == "L") {
    //     for (let i=0; i<pieceHeight1EmptyCols.length; i++){
            
    //             if(pieceWidth == 1){
    //                 availableCols.push(pieceHeight1EmptyCols[i])
    //             }
    //             if(pieceWidth == 2){
    //                 if((pieceHeight1EmptyCols[i+1])){
    //                     if((parseInt(pieceHeight1EmptyCols[i]) + 1) == parseInt(pieceHeight1EmptyCols[i+1])){
    //                         availableCols.push(pieceHeight1EmptyCols[i])
    //                     }
    //                 }
    //             }
    //             if(pieceWidth == 3){

    //                 if((pieceHeight1EmptyCols[i+1]) && (pieceHeight1EmptyCols[i+2])){
    //                     if((parseInt(pieceHeight1EmptyCols[i]) + 1) == parseInt(pieceHeight1EmptyCols[i+1])
    //                         && (parseInt(pieceHeight1EmptyCols[i]) + 2) == parseInt(pieceHeight1EmptyCols[i+2])){
    //                         availableCols.push(pieceHeight1EmptyCols[i])
    //                     }
    //                 }

    //             }
            
    //     };
    // } else if (piece == "S" || piece == "Z" || piece == "T"){

    //     for (let i=0; i<pieceHeight1EmptyCols.length; i++){
    //         let height1ColNum = parseInt(pieceHeight1EmptyCols[i]);

    //         if(piece == "S"){
    //             if (pieceHeight1EmptyCols.includes(height1ColNum+1) && pieceHeight2EmptyCols.includes(height1ColNum+2)){
    //                 availableCols.push(pieceHeight1EmptyCols[i])
    //             }
    //         }

    //         if(piece == "Z"){
    //             if (pieceHeight1EmptyCols.includes(height1ColNum+1) && pieceHeight2EmptyCols.includes(height1ColNum-1)){
    //                 // have to subtract 1 to reflect the top left cell used in other parts of the logic
    //                 availableCols.push(pieceHeight1EmptyCols[i]-1)
    //             }
    //         }

    //         if(piece == "T"){
    //             if (pieceHeight2EmptyCols.includes(height1ColNum+1) && pieceHeight2EmptyCols.includes(height1ColNum-1)){
    //                 availableCols.push(pieceHeight1EmptyCols[i]-1)
    //             }
    //         }

    //     }
    // }

    // #endregion legacy code

    // console.log("availableCols is: ", availableCols);
    return availableCols;
    
};

function generateOPiece(){
    // currentlySelectedPiece = "O";
    resetCurrentArrays();
    
    

    // always generate the item from the top-left corner of the grid

    

    
    // let availableCols = getAvailableColumns("O");
    let availableCols = getAvailableColumns(OPieceMatrix);

    if (availableCols.length > 0){
        currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        currentlySelectedPieceMatrix = OPieceMatrix;
        getCurrentUserArray();
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new O piece. availableCols is: ", availableCols);
        blockedPieces.push("O");
        generateUnblockedPiece();
    }
    
}


function generateIPiece(){

    // currentlySelectedPiece = "I";
    resetCurrentArrays();
    // The top left most cell of an I piece can be generatated in any column in the top most row 
    currentUserRefCellIndex = Math.floor(Math.random()*(noOfCols));

    // let Ipiece = [];
    // Ipiece.push(currentUserRefCellIndex, (currentUserRefCellIndex+(noOfCols*1)), (currentUserRefCellIndex+(noOfCols*2)), (currentUserRefCellIndex+(noOfCols*3)));

    


    // let availableCols = getAvailableColumns("I");
    let availableCols = getAvailableColumns(IPieceMatrix);

    if (availableCols.length > 0){
        currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        currentlySelectedPieceMatrix = IPieceMatrix;
        getCurrentUserArray();
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new I piece. availableCols is: ", availableCols);
        blockedPieces.push("I");
        generateUnblockedPiece();
    }


};

function generateJPiece(){

    resetCurrentArrays();

    // The top left most cell of an J piece matrix can be generatated in any column from 0 to (no of cols - 2) in the top most row 
    // currentUserRefCellIndex = Math.floor((Math.random()*(noOfCols-1)));

    

    

    // let availableCols = getAvailableColumns("J");
    let availableCols = getAvailableColumns(JPieceMatrix);

    if (availableCols.length > 0){
        currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        currentlySelectedPieceMatrix = JPieceMatrix;
        getCurrentUserArray();
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new J piece. availableCols is: ", availableCols);
        blockedPieces.push("J");
        generateUnblockedPiece();
    }
}

function generateLPiece(){

    resetCurrentArrays();
    // The top left most cell of an L piece can be generatated in any column from 0 to (no of cols - 2) in the top most row 
    // currentUserRefCellIndex = Math.floor((Math.random()*(noOfCols-1)));



    

    // let availableCols = getAvailableColumns("L");
    let availableCols = getAvailableColumns(LPieceMatrix);

    if (availableCols.length > 0){
        currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        currentlySelectedPieceMatrix = LPieceMatrix;
        getCurrentUserArray();
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new L piece. availableCols is: ", availableCols);
        blockedPieces.push("L");
        generateUnblockedPiece();
    }
}

function generateSPiece(){

    resetCurrentArrays();

    // The top left most cell of an S piece matrix can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentUserRefCellIndex = Math.floor((Math.random()*(noOfCols-2)));

    

    

    // let availableCols = getAvailableColumns("S");
    let availableCols = getAvailableColumns(SPieceMatrix);

    if (availableCols.length > 0){
        currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        currentlySelectedPieceMatrix = SPieceMatrix;
        getCurrentUserArray();
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new S piece. availableCols is: ", availableCols);
        blockedPieces.push("S");
        generateUnblockedPiece();
    }

}

function generateZPiece() {

    resetCurrentArrays();
    // The top left most cell of an Z piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentUserRefCellIndex = Math.floor((Math.random()*(noOfCols-2)));

    

    // let availableCols = getAvailableColumns("Z");
    let availableCols = getAvailableColumns(ZPieceMatrix);

    if (availableCols.length > 0){
        currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        currentlySelectedPieceMatrix = ZPieceMatrix;
        getCurrentUserArray();
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new Z piece. availableCols is: ", availableCols);
        blockedPieces.push("Z");
        generateUnblockedPiece();
    }
}

function generateTPiece() {

    resetCurrentArrays();
    // The top left most cell of an T piece can be generatated in any column from 0 to (no of cols - 3) in the top most row 
    // currentUserRefCellIndex = Math.floor((Math.random()*(noOfCols-2)));

   

    // let availableCols = getAvailableColumns("T");
    let availableCols = getAvailableColumns(TPieceMatrix);

    if (availableCols.length > 0){
        currentUserRefCellIndex = availableCols[Math.floor(Math.random()*(availableCols.length))];
        currentlySelectedPieceMatrix = TPieceMatrix;
        getCurrentUserArray();
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
    } else {
        // console.log("There is no space to generate new T piece. availableCols is: ", availableCols);
        blockedPieces.push("T");
        generateUnblockedPiece();
    }
}

function getCurrentFloorShiftArray(){

    floorShiftArray = [];
    let highestRow = findFloor();
    let refIndRow = Math.floor(currentUserRefCellIndex/noOfCols);
    let noOfRowsToShift = highestRow - refIndRow - 1;

    floorShiftArray = currentUserArray.map(index =>{
        return (index+(noOfRowsToShift*noOfCols));
    })
    
}

function getCurrentUserArray(){
     currentUserArray = [];
    //  console.log("currentUserRefCellIndex value received inside getCurrentUserArray() is: ", currentUserRefCellIndex);
    //  The currentUserRefCellIndex is the starting index of the topmost cell in the matrix
    currentlySelectedPieceMatrix.forEach((row, rowAdd)=>{
        // For toprow, we need to add +1 for each subsequent item from the currentUserRefCellIndex
        row.forEach((cell,colIndex)=>{
            // console.log("In currentarraygen loop, rowindex is noW: ", rowAdd, " ,column index is now: ", colIndex, " and truthy is: ", cell);
            // only if the value is "True" is a value added to the array
            if(cell){
                currentUserArray.push(currentUserRefCellIndex + (rowAdd*noOfCols) + colIndex);
            }
        })
    });
    getCurrentFloorShiftArray();
    // currentUserArray.forEach(addFloatingBricks);
}


function generateRandomPiece(){
    let randomSel = Math.floor(Math.random() * 7);
    // console.log("randomSel number is: ", randomSel);
    
    switch(randomSel){
        case 0:
        generateOPiece();
        break;

        case 1:
        generateIPiece();
        break;

        case 2:
        generateJPiece();
        break;

        case 3:
        generateLPiece();
        break;

        case 4:
        generateSPiece();
        break;

        case 5:
        generateZPiece();
        break;

        case 6:
        generateTPiece();
        break;
    }
}



// #endregion piece generation logic

// #region logic for left and right movement
function movePieceRight(){
    getCurrentUserArray();
    // console.log("currentUserArray before movePieceRight is: ", currentUserArray);
    // The right most column in all the elements from currentUserArray is used to check for right wall
    let colMap = currentUserArray.map(index =>{
        return (index%noOfCols);
    })
    let rightmostCol = Math.max(...colMap);

    let flooredPiecesCheck = currentUserArray.filter(index =>{
        if(cellsArr[index+1]){
        return cellsArr[index+1].classList.contains("flooredBrick");
        }
    })
    // if (flooredPiecesCheck.length>0){
    // console.log("right flooredPiecesCheck is: ", flooredPiecesCheck);
    // }
    
    if (!(rightmostCol == (noOfCols -1)) && !(flooredPiecesCheck.length >0)){
        clearFloatingBricks();
        clearFloorShiftBricks();
        // console.log("currentUserRefCellIndex before movePieceRight is: ", currentUserRefCellIndex);
        currentUserRefCellIndex++;
        // console.log("currentUserRefCellIndex after movePieceRight is: ", currentUserRefCellIndex);
        getCurrentUserArray();
        // currentUserArray = currentUserArray.map(pieceCell => pieceCell +1);
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
        // console.log("The currentUserArray is: ", currentUserArray);
    } else {
        // console.log("The piece has hit a right wall");
    }
};

function movePieceLeft(){
    getCurrentUserArray();
   // The left most column in all the elements from currentUserArray is used to check for left wall
    let colMap = currentUserArray.map(index =>{
        return (index%noOfCols);
    })
    let leftmostCol = Math.min(...colMap);

    let flooredPiecesCheck = currentUserArray.filter(index =>{
        if(cellsArr[index-1]){
        return cellsArr[index-1].classList.contains("flooredBrick");
        }
    })
    // if (flooredPiecesCheck.length>0){
    // console.log("left flooredPiecesCheck is: ", flooredPiecesCheck);
    // }

    if(!(leftmostCol == 0) && !(flooredPiecesCheck.length >0) ){
        clearFloatingBricks();
        clearFloorShiftBricks();
        // console.log("currentUserRefCellIndex before movePieceLeft is: ", currentUserRefCellIndex);
        currentUserRefCellIndex--;
        // console.log("currentUserRefCellIndex after movePieceLeft is: ", currentUserRefCellIndex);
        getCurrentUserArray();
        // currentUserArray = currentUserArray.map(pieceCell => pieceCell -1);
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
        // console.log("The currentUserArray is: ", currentUserArray);
    } else {
        // console.log("The piece has hit a left wall");
    }
};

function rotatePieceClockwise(){

    getCurrentUserArray();
    let prevUserArr = currentUserArray;

    let currentMatrixLength = currentlySelectedPieceMatrix[0].length;
    let currentMatrixHeight = currentlySelectedPieceMatrix.length;
    let dimensionDifference = Math.abs(currentMatrixLength - currentMatrixHeight);

    let colMap = currentUserArray.map(index =>{
        return (index%noOfCols);
    });

    let rowMap = currentUserArray.map(index =>{
        return (Math.floor(index/noOfCols));
    });

    let rightmostCol = Math.max(...colMap);
    // let leftmostCol = Math.min(...colMap);
    let bottommostRow = Math.max(...rowMap);
    
    let rightOverflowCheck = rightmostCol + dimensionDifference;
    let bottomOverflowCheck = bottommostRow + dimensionDifference;

    // Right walls check

    let leftCascading = false;
    // if((rightmostCol == (noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
    if( (rightOverflowCheck > (noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
        currentUserRefCellIndex -= rightOverflowCheck-(noOfCols-1);
        leftCascading = true;
    }

    // Bottom walls check
    let upperCascading = false;
    //  if((bottommostRow == (noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
     if((bottomOverflowCheck > (noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
        currentUserRefCellIndex -= ((bottomOverflowCheck-(noOfRows-1))*noOfCols);
        upperCascading = true;
    }

    let checkWallInRotationMat = rotateMatrixClockwise(currentlySelectedPieceMatrix);
    currentlySelectedPieceMatrix = checkWallInRotationMat;

    getCurrentUserArray();
    let bricksInTheWay = currentUserArray.filter(index =>{
        return cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert 
        currentUserArray = prevUserArr;
        let checkWallInRotationMat = rotateMatrixAntiClockwise(currentlySelectedPieceMatrix);
        currentlySelectedPieceMatrix = checkWallInRotationMat;
        if(leftCascading == true){
            currentUserRefCellIndex += rightOverflowCheck-(noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            currentUserRefCellIndex += ((bottomOverflowCheck-(noOfRows-1))*noOfCols);
            upperCascading = false;
        }

    }

    clearFloatingBricks();
    clearFloorShiftBricks();
    currentUserArray.forEach(addFloatingBricks);
    floorShiftArray.forEach(addFloorShiftBricks);
}

function rotatePieceAntiClockwise(){

    getCurrentUserArray();
    let prevUserArr = currentUserArray;

    let currentMatrixLength = currentlySelectedPieceMatrix[0].length;
    let currentMatrixHeight = currentlySelectedPieceMatrix.length;
    let dimensionDifference = Math.abs(currentMatrixLength - currentMatrixHeight);

    let colMap = currentUserArray.map(index =>{
        return (index%noOfCols);
    });

    let rowMap = currentUserArray.map(index =>{
        return (Math.floor(index/noOfCols));
    });

    let rightmostCol = Math.max(...colMap);
    // let leftmostCol = Math.min(...colMap);
    let bottommostRow = Math.max(...rowMap);
    
    let rightOverflowCheck = rightmostCol + dimensionDifference;
    let bottomOverflowCheck = bottommostRow + dimensionDifference;

    // Right walls check

    let leftCascading = false;
    // if((rightmostCol == (noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
    if( (rightOverflowCheck > (noOfCols-1)) && (currentMatrixHeight > currentMatrixLength)){
        currentUserRefCellIndex -= rightOverflowCheck-(noOfCols-1);
        leftCascading = true;
    }

    // Bottom walls check
    let upperCascading = false;
    //  if((bottommostRow == (noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
     if((bottomOverflowCheck > (noOfRows-1)) && (currentMatrixHeight < currentMatrixLength)){
        currentUserRefCellIndex -= ((bottomOverflowCheck-(noOfRows-1))*noOfCols);
        upperCascading = true;
    }

    let checkWallInRotationMat = rotateMatrixAntiClockwise(currentlySelectedPieceMatrix);
    currentlySelectedPieceMatrix = checkWallInRotationMat;

    getCurrentUserArray();
    let bricksInTheWay = currentUserArray.filter(index =>{
        return cellsArr[index].classList.contains("flooredBrick");
    });

    if (bricksInTheWay.length > 0){
        // Revert 
        currentUserArray = prevUserArr;
        let checkWallInRotationMat = rotateMatrixClockwise(currentlySelectedPieceMatrix);
        currentlySelectedPieceMatrix = checkWallInRotationMat;
        if(leftCascading == true){
            currentUserRefCellIndex += rightOverflowCheck-(noOfCols-1);
            leftCascading = false;
        }

        if(upperCascading == true){
            currentUserRefCellIndex += ((bottomOverflowCheck-(noOfRows-1))*noOfCols);
            upperCascading = false;
        }

    }

    clearFloatingBricks();
    clearFloorShiftBricks();
    currentUserArray.forEach(addFloatingBricks);
    floorShiftArray.forEach(addFloorShiftBricks);
}

// #endregion logic for left and right movement

function movePieceDown() {
    // console.log("movePieceDown was run");
    clearFloatingBricks();
    clearFloorShiftBricks();
    if(!checkFloor() ){
        
        currentUserRefCellIndex += noOfCols;
        getCurrentUserArray();
        // currentUserArray = currentUserArray.map(pieceCell => pieceCell + noOfCols);
      
        // optionally make the object bricked instantly rather than waiting till the next movement
        // if(!checkFloor()){
        currentUserArray.forEach(addFloatingBricks);
        floorShiftArray.forEach(addFloorShiftBricks);
        // } else {
        //     currentUserArray.forEach(addFlooredBricks);
        //     resetCurrentArrays();
        // }
        // console.log(currentUserArray);
    }else {
        currentUserArray.forEach(addFlooredBricks);
        
        checkBrickedRows();
        
        // console.log("The piece has hit the bottom wall or a floored brick");
    }
};

function instaDrop() {

    let floorRow = findFloor();
    let refRow = Math.floor(currentUserRefCellIndex/noOfCols);
    let noOfRowsToShift = floorRow - refRow - 1;
    currentUserRefCellIndex += (noOfRowsToShift*noOfCols);
    getCurrentUserArray();
    currentUserArray.forEach(addFlooredBricks);
    checkBrickedRows();
}

function checkFloor(){
    
    getCurrentUserArray();
    let floorHitCells = currentUserArray.filter(cell =>{
       return ((cell + noOfCols) >= boardSize) || (cellsArr[cell + noOfCols].classList.contains("flooredBrick"))       
    });

    // console.log("floorhit cells returned is: ", floorHitCells);
    return floorHitCells.length >0 ? true : false;
};

function findFloor(){
    
    let relevantCellsIndex = [];
  

    // If there is a 'gap' in between two indices vertically, it is relevant
    currentUserArray.forEach(index =>{
        if (!currentUserArray.includes((parseInt(index)+noOfCols))){
            relevantCellsIndex.push(index);
        }
    })

    let refIndRow = Math.floor(currentUserRefCellIndex/noOfCols);

    let floorMap = relevantCellsIndex.map(releIndex=>{
        let highestFloorRow;
        let releIndexRow = Math.floor(releIndex/noOfCols);
        let extraDepth = releIndexRow - refIndRow;
        let brickCheck = cellsArr.filter(cell =>{
            return((parseInt(cell.id) % noOfCols == releIndex % noOfCols) && 
            (parseInt(cell.id) > releIndex) && (cell.classList.contains("flooredBrick")))
        })
        if(brickCheck.length>0){
            let brickRowMap = brickCheck.map(brickInWay =>{
                return Math.floor(parseInt(brickInWay.id)/noOfCols);
            });
            highestFloorRow = Math.min(...brickRowMap);
        } else {
            highestFloorRow = noOfRows;
        }
        // The result is shifted to be as if being just below the refIndRow
        return (highestFloorRow-extraDepth);
    })
    // console.log("floorMap for the piece is: ", floorMap);
    return Math.min(...floorMap);
    
};

document.addEventListener("keydown", (e)=>{
    
    if(!gameOver && !paused){
    
        if (e.target.tagName == "INPUT") return;

        e.preventDefault();
        if(e.key == "ArrowLeft"){
            movePieceLeft();
        }

        if(e.key == "ArrowRight"){
            movePieceRight();
        }

        if(e.key == "ArrowDown"){
            movePieceDown();
        }

        if(e.key == " ") {

            rotatePieceClockwise()
        }

        if(e.key == "ArrowUp") {
            
            instaDrop();
        }

        if(e.key == "Shift") {
            rotatePieceAntiClockwise();
        }
    }
    
});

moveLeftBtn.addEventListener("click", () => {
    if(!gameOver && !paused){
        movePieceLeft();
    }
});

moveRightBtn.addEventListener("click", () => {
    if(!gameOver && !paused){
        movePieceRight();
    }
});

moveDownBtn1.addEventListener("mousedown", () => {
    if(!gameOver && !paused){
        movePieceDown();
    }
});

moveDownBtn2.addEventListener("mousedown", () => {
    if(!gameOver && !paused){
        movePieceDown();
    }
});

rotateClockwiseBtn.addEventListener("click", () => {
    if(!gameOver && !paused){
        rotatePieceClockwise();
    }
});

instaDownBtn1.addEventListener("click", () => {
    if(!gameOver && !paused){
        instaDrop();
    }
});

instaDownBtn2.addEventListener("click", () => {
    if(!gameOver && !paused){
        instaDrop();
    }
});


rotateAntiClockwiseBtn.addEventListener("click", () => {
    if(!gameOver && !paused){
        rotatePieceAntiClockwise();
    }
});

function getRowsOfBricked(){
    let rowsOfBricked = [];
    let brickedCells = [...document.getElementsByClassName("flooredBrick")];
    brickedCells.forEach(cell =>{
        // rowsOfBricked collects the row numbers of all the bricked cells
        rowsOfBricked.push(Math.floor(parseInt(cell.id)/noOfCols));
    });
    return rowsOfBricked;
}

function getFullRowsArray(rowsOfBricked){
    // uniqueRowsArr stores the unique rows with atleast one bricked cell
    let uniqueRowsArr = [...new Set(rowsOfBricked)];
    // fullRowsArr stores the unique rows with all cells bricked in it
    let fullRowsArr = [];

    uniqueRowsArr.forEach(uniqueRowNumber =>{
        // #region legacy code
        // let localCounter =0;
        // for (let i=0; i<rowsOfBricked.length; i++){
        //     if (uniqueRowNumber == rowsOfBricked[i]){
        //         localCounter++;
        //         // console.log(`local counter for row number ${uniqueRowNumber}, comparing ${rowsOfBricked[i]} is ${localCounter}`);
        //         if (localCounter >= noOfCols){
        //             fullRowsArr.push(uniqueRowNumber);
        //             break;
        //         }
        //     }
            
        // }
        // #endregion legacy code
        let countArr = rowsOfBricked.filter(row =>{
            return (row == uniqueRowNumber);
        });
        if (countArr.length == noOfCols){
            fullRowsArr.push(uniqueRowNumber);
        }
    });

    // console.log("rowsOfBricked is: ", rowsOfBricked);
    // console.log("uniqueRowsArr is: ", uniqueRowsArr);
    // console.log("fullRowsArr is: ", fullRowsArr);
    return fullRowsArr;
};

function clearFullRows(fullRowsArr){
    fullRowsArr.forEach(fullRow =>{
            let startingInd = parseInt(fullRow) * noOfCols;
            let finishingInd = startingInd + (noOfCols-1);

            for (let i=startingInd; i <= finishingInd; i++){
                cellsArr[i].classList.remove("flooredBrick");
            };
            score++;
            scoreValue.innerHTML = score;
        });
}

function shiftBricks(fullRowsArr){

    // Sorting array numerically in ascending order (top of grid to bottom)
    fullRowsArr.sort(function(a,b){return a - b});

    // #region legacy code
    // fullRowsArr.forEach(clearedRow =>{
        
    //     let shiftBricksTill = parseInt(clearedRow) * noOfCols;
    //     let noOfRowsRemoved = fullRowsArr.length;
    //     // console.log("clearedRow being used is: ", clearedRow ,", shiftBricksTill is: ", shiftBricksTill, " and noOfRowsRemoved is: ", noOfRowsRemoved);
    //     let brickedCells = [...document.getElementsByClassName("flooredBrick")];
    //     let newIndicesToAdd = [];
    //     brickedCells.forEach(brick =>{
    //         let brickInd = parseInt(brick.id);
    //         if (brickInd < shiftBricksTill){
    //             // console.log("brickInd used inside cascade logic is: ", brickInd);
    //             // remove flooredBrick class on cell and add it to (noOfCols*noOfRowsRemoved) index
    //             brick.classList.remove("flooredBrick");
    //             let newIndex = brickInd +(noOfCols);
    //             newIndicesToAdd.push(newIndex);
    //             // console.log("cascaded cell referenced is: ", cellsArr[brickInd +(noOfCols*noOfRowsRemoved)]);
                
    //         }
    //     });
    //     newIndicesToAdd.forEach(index =>{
    //         cellsArr[index].classList.add("flooredBrick");
    //     });
            
    // });
    // #endregion legacy code
            
    let brickedCells = [...document.getElementsByClassName("flooredBrick")];
    let newIndicesToAdd = [];
    brickedCells.forEach(cell =>{
        let cellIndex = parseInt(cell.id);
        let cellRow = Math.floor(cellIndex/noOfCols);

        let shiftBy = fullRowsArr.filter(fullRow => fullRow > cellRow).length;
        if (shiftBy >0){
            cell.classList.remove("flooredBrick");
            let newIndex = cellIndex + (shiftBy*noOfCols);
            newIndicesToAdd.push(newIndex);
        }
    });
    newIndicesToAdd.forEach(index =>{
            cellsArr[index].classList.add("flooredBrick");
        });            
       
};

function checkBrickedRows(){

    let rowsOfBricked = getRowsOfBricked();

    // Checking for gameOver condition
    if(rowsOfBricked.includes(0)){
        // console.log("Game over! The bricks have hit the ceiling!");
        clearInterval(pieceDownInterval);
        pieceDownInterval=null;
        gameOver = true;
        statusHeading.innerHTML = "Game Over! Press start to play again";
    };

    if(!gameOver){
        
        let fullRowsArr = getFullRowsArray(rowsOfBricked);
        
        // console.log("fullRowsArr.length >0 was registered ");
        
        clearFullRows(fullRowsArr);

            // The floored bricks would still be floating in place b/w the rows which are just cleared needs to cascade down
        pauseGame();
        setTimeout(() => {
            shiftBricks(fullRowsArr);
            resetCurrentArrays();
            generateRandomPiece();
            unPauseGame();
            
        },200);           
    
    }
};
