import * as docElems from "../../../globalVariables/docElems.js";

import stateVar from "../../../globalVariables/stateVars.js";

const {
  setUpIndependentEventListeners,
  setUpDependentEventListeners,
  setUpTouchControls,
} = await import("../../../eventListeners/directEventLists.js");

describe("testing independent event listeners", () => {
  setUpIndependentEventListeners();

  test("loading the page causes the audio DOM elements to be preloaded", () => {
    window.dispatchEvent(new Event("load"));
    expect(docElems.newHighScoreSound.preload).toBe("auto");
    expect(docElems.gameOverSound.preload).toBe("auto");
    expect(docElems.floorDropSound.preload).toBe("auto");
    expect(docElems.mainLoopMusic.preload).toBe("auto");
    expect(docElems.pauseSound.preload).toBe("auto");
    expect(docElems.pieceRotate.preload).toBe("auto");
    expect(docElems.rowCleared.preload).toBe("auto");
  });

  test("clicking music button while (on) is updating to (off)", () => {
    docElems.musicTriggerBtn.dispatchEvent(new Event("click"));
    expect(
      docElems.musicTriggerBtn.classList.contains("bi-file-music-fill"),
    ).toBe(false);
    expect(docElems.musicTriggerBtn.classList.contains("bi-file-music")).toBe(
      true,
    );
  });

  test("clicking music button while (off) is updating to (on)", () => {
    docElems.musicTriggerBtn.dispatchEvent(new Event("click"));
    expect(
      docElems.musicTriggerBtn.classList.contains("bi-file-music-fill"),
    ).toBe(true);
    expect(docElems.musicTriggerBtn.classList.contains("bi-file-music")).toBe(
      false,
    );
  });

  test("clicking sound button while (on) is updating to (off)", () => {
    docElems.soundTriggerBtn.dispatchEvent(new Event("click"));
    expect(
      docElems.soundTriggerBtn.classList.contains("bi-volume-down-fill"),
    ).toBe(false);
    expect(docElems.soundTriggerBtn.classList.contains("bi-volume-mute")).toBe(
      true,
    );
  });

  test("clicking sound button while (off) is updating to (on)", () => {
    docElems.soundTriggerBtn.dispatchEvent(new Event("click"));
    expect(
      docElems.soundTriggerBtn.classList.contains("bi-volume-down-fill"),
    ).toBe(true);
    expect(docElems.soundTriggerBtn.classList.contains("bi-volume-mute")).toBe(
      false,
    );
  });

  describe("testing 'custom' entries input field for 'noOfColsSel', 'noOfRowsSel' and 'gameSpeedSel' ", () => {
    test("selecting drop-down values other than 'custom' no of columns for tetris board selection logic", () => {
      docElems.noOfColsSel.value = "5";
      const change = new Event("change");
      docElems.noOfColsSel.dispatchEvent(change);

      expect(docElems.customColsSel.hidden).toBe(true);
      expect(docElems.customColsSel.disabled).toBe(true);
      expect(docElems.customColsSel.required).toBe(true);
      expect(docElems.labelCustomColsSel.hidden).toBe(true);
      expect(docElems.customColInvalidFeedback.hidden).toBe(true);
    });

    test("selecting custom no of columns for tetris board selection logic", () => {
      docElems.noOfColsSel.value = "custom";
      const change = new Event("change");
      docElems.noOfColsSel.dispatchEvent(change);

      expect(docElems.customColsSel.hidden).toBe(false);
      expect(docElems.customColsSel.disabled).toBe(false);
      expect(docElems.customColsSel.required).toBe(false);
      expect(docElems.labelCustomColsSel.hidden).toBe(false);
      expect(docElems.customColInvalidFeedback.hidden).toBe(false);
    });

    test("testing invalid feedback logic when a custom value is changed to an invalid value", () => {
      docElems.noOfColsSel.value = "custom";
      const change = new Event("change");
      docElems.noOfColsSel.dispatchEvent(change);

      docElems.customColsSel.value = 4;
      docElems.customColsSel.dispatchEvent(change);

      expect(docElems.customColsSel.classList.contains("is-invalid")).toBe(
        true,
      );

      expect(docElems.customColsSel.classList.contains("is-valid")).toBe(false);
    });

    test("testing invalid feedback logic when a custom value is changed to an valid value", () => {
      docElems.noOfColsSel.value = "custom";
      const change = new Event("change");
      docElems.noOfColsSel.dispatchEvent(change);

      docElems.customColsSel.value = 45;
      docElems.customColsSel.dispatchEvent(change);

      expect(docElems.customColsSel.classList.contains("is-invalid")).toBe(
        false,
      );

      expect(docElems.customColsSel.classList.contains("is-valid")).toBe(true);
    });
  });
});

describe("testing game state dependent event listeners", () => {
  setUpDependentEventListeners();
  setUpTouchControls();
  const gridItems = document.getElementsByClassName("gridItem");
  function testPreStartConditions() {
    expect(gridItems.length).toBe(0);
    expect(stateVar.gameOver).toBe(true);
    expect(stateVar.paused).toBe(false);
  }
  test("before clicking on form submit, no gridItems are generated", () => {
    testPreStartConditions();
  });
  describe("Clicking on 'submit' on game settings form by the user doesn't start the game if the values are invalid", () => {
    const change = new Event("change");

    test("The required number of DOM div elements corresponding to the cols*rows board size is not generated for invalid column entry values", () => {
      docElems.noOfColsSel.value = "custom";
      docElems.noOfColsSel.dispatchEvent(change);
      docElems.customColsSel.value = 4;
      docElems.customColsSel.dispatchEvent(change);
      docElems.form.dispatchEvent(new Event("submit"));
      console.log("The noOfCols value is: ", docElems.noOfColsSel.value);
      testPreStartConditions();
    });
  });
  describe("Clicking on 'submit' on game settings form by the user starts the game if the values are valid", () => {
    const change = new Event("change");

    test("The required number of DOM div elements corresponding to the cols*rows board size is being generated", () => {
      docElems.noOfColsSel.value = "10";
      docElems.noOfColsSel.dispatchEvent(change);
      docElems.form.dispatchEvent(new Event("submit"));
      expect(gridItems.length).toBe(stateVar.boardSize);
      expect(stateVar.gameOver).toBe(false);
      expect(stateVar.paused).toBe(false);
    });

    let brickCheck = false;
    function checkFloatingBrickInTopRow() {
      brickCheck = false;
      for (let i = 0; i < stateVar.noOfCols; i++) {
        if (gridItems[i].classList.contains("floatingBrick")) {
          brickCheck = true;
          console.log("brickCheck at i", i, " is ", brickCheck);
        }
      }
    }

    function findFloatingBricksIndices() {
      let indexRef = [];
      [...gridItems].forEach((gridItem, index) => {
        if (gridItem.classList.contains("floatingBrick")) {
          indexRef.push(index);
        }
      });
      return indexRef;
    }

    test("Atleast one of the DOM cells in the top most row of the board will have a 'floatingBrick' class in it", () => {
      checkFloatingBrickInTopRow();
      console.log(
        "index of bricks initially generated are: ",
        findFloatingBricksIndices(),
      );
      expect(brickCheck).toBe(true);
    });

    test("The topmost row DOM of game board will not have any 'floatingBrick' class after the first downward movement", async () => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            checkFloatingBrickInTopRow();
            expect(brickCheck).toBe(false);
            resolve();
          } catch (err) {
            reject(err);
          }
        }, stateVar.gameSpeed + 100);
      });
    }, 10000);

    describe("Testing linear movement logic", () => {
      function simulateRightKeyPress() {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowRight" }),
        );
      }

      function simulateLeftKeyPress() {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowLeft" }),
        );
      }

      function simulateDownKeyPress() {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "ArrowDown" }),
        );
      }
      function simulateRightMoveIconClick() {
        docElems.moveRightBtn.dispatchEvent(new Event("click"));
      }
      function simulateLeftMoveIconClick() {
        docElems.moveLeftBtn.dispatchEvent(new Event("click"));
      }
      function simulateDownMove1IconClick() {
        docElems.moveDownBtn1.dispatchEvent(new Event("mousedown"));
      }
      function simulateDownMove2IconClick() {
        docElems.moveDownBtn2.dispatchEvent(new Event("mousedown"));
      }
      test("Using the right key on the keyboard moves the piece right by one cell", () => {
        let currentIndices = findFloatingBricksIndices();
        console.log(
          "index of bricks just before running right move logic are: ",
          currentIndices,
        );
        let blockOnRight = false;

        function checkRightMoveLogic() {
          if (blockOnRight === false) {
            currentIndices.forEach((currentIndex, indexNo) => {
              expect(currentIndex + 1).toBe(newIndices[indexNo]);
            });
          } else {
            console.log("right move blocked");
            expect(newIndices).toEqual(currentIndices);
          }
        }

        function checkBlockOnRight() {
          currentIndices.forEach((blockIndex) => {
            if (
              gridItems[parseInt(blockIndex) + 1].classList.contains(
                "flooredBrick",
              ) ||
              (parseInt(blockIndex) + 1) % stateVar.noOfCols === 0
            ) {
              blockOnRight = true;
              return;
            } else {
              blockOnRight = false;
            }
          });
        }
        // Check if flooredBrick class in cell next to piece cell is preventing rightwards movement
        gridItems[
          parseInt(currentIndices[currentIndices.length - 1]) + 1
        ].classList.add("flooredBrick");

        simulateRightKeyPress();

        simulateRightMoveIconClick();
        let newIndices = findFloatingBricksIndices();
        console.log(
          "updated indices after arrow right with flooredBrick class blocking piece present are: ",
          newIndices,
        );
        checkBlockOnRight();
        checkRightMoveLogic();

        // Check if lack of flooredBrick class in cell next to piece cell is allowing rightwards movement

        gridItems[
          parseInt(currentIndices[currentIndices.length - 1]) + 1
        ].classList.remove("flooredBrick");
        simulateRightKeyPress();

        newIndices = findFloatingBricksIndices();
        console.log(
          "updated indices after arrow right with flooredBrick class blocking piece absent are: ",
          newIndices,
        );
        checkBlockOnRight();
        checkRightMoveLogic();
      });

      test("Using the left key on the keyboard moves the piece left by one cell", () => {
        let currentIndices = findFloatingBricksIndices();
        let blockOnLeft = false;

        function checkLeftMoveLogic() {
          if (blockOnLeft === false) {
            currentIndices.forEach((currentIndex, indexNo) => {
              expect(currentIndex - 1).toBe(newIndices[indexNo]);
            });
          } else {
            console.log("left move blocked");
            expect(newIndices).toEqual(currentIndices);
          }
        }

        function checkBlockOnLeft() {
          currentIndices.forEach((blockIndex) => {
            if (
              gridItems[parseInt(blockIndex) - 1].classList.contains(
                "flooredBrick",
              ) ||
              parseInt(blockIndex) % stateVar.noOfCols === 0
            ) {
              blockOnLeft = true;
              return;
            } else {
              blockOnLeft = false;
            }
          });
        }
        // Check if flooredBrick class in cell next to piece cell is preventing leftwards movement
        gridItems[
          parseInt(currentIndices[currentIndices.length - 1]) - 1
        ].classList.add("flooredBrick");

        simulateLeftKeyPress();

        simulateLeftMoveIconClick();
        let newIndices = findFloatingBricksIndices();
        console.log(
          "updated indices after arrow left with flooredBrick class blocking piece present are: ",
          newIndices,
        );
        checkBlockOnLeft();
        checkLeftMoveLogic();

        // Check if lack of flooredBrick class in cell next to piece cell is allowing leftwards movement

        gridItems[
          parseInt(currentIndices[currentIndices.length - 1]) - 1
        ].classList.remove("flooredBrick");
        simulateLeftKeyPress();

        newIndices = findFloatingBricksIndices();
        console.log(
          "updated indices after arrow left with flooredBrick class blocking piece absent are: ",
          newIndices,
        );
        checkBlockOnLeft();
        checkLeftMoveLogic();
      });

      test("Using the down key on the keyboard moves the piece down by one cell", () => {
        let currentIndices = findFloatingBricksIndices();
        console.log(
          "currentIndices at starting of down block is: ",
          currentIndices,
        );
        let blockOnDown = false;

        function checkDownMoveLogic() {
          if (blockOnDown === false) {
            currentIndices.forEach((currentIndex, indexNo) => {
              expect(currentIndex + parseInt(stateVar.noOfCols)).toBe(
                newIndices[indexNo],
              );
            });
          } else {
            console.log("down move blocked");
            expect(newIndices).toEqual(currentIndices);
          }
        }

        function checkBlockOnDown() {
          currentIndices.forEach((blockIndex) => {
            if (
              gridItems[
                parseInt(blockIndex) + parseInt(stateVar.noOfCols)
              ].classList.contains("flooredBrick") ||
              parseInt(blockIndex) + parseInt(stateVar.noOfCols) >=
                parseInt(stateVar.boardSize)
            ) {
              blockOnDown = true;
              return;
            } else {
              blockOnDown = false;
            }
          });
        }

        // Check if lack of flooredBrick class in cell next to piece cell is allowing downwards movement

        simulateDownKeyPress();
        let newIndices = findFloatingBricksIndices();
        checkBlockOnDown();
        checkDownMoveLogic();

        simulateDownMove1IconClick();
        currentIndices = newIndices;
        newIndices = findFloatingBricksIndices();
        checkBlockOnDown();
        checkDownMoveLogic();

        simulateDownMove2IconClick();
        currentIndices = newIndices;
        newIndices = findFloatingBricksIndices();
        checkBlockOnDown();
        checkDownMoveLogic();
        console.log(
          "updated indices after arrow down with flooredBrick class blocking piece absent are: ",
          newIndices,
        );

        // Check if presence of flooredBrick class in cell below next to tetris cell piece is allowing downwards movement

        currentIndices = newIndices;
        checkFloatingBrickInTopRow();
        expect(brickCheck).toBe(false);
        expect;
        gridItems[
          parseInt(currentIndices[currentIndices.length - 1]) +
            parseInt(stateVar.noOfCols)
        ].classList.add("flooredBrick");
        simulateDownKeyPress();

        newIndices = findFloatingBricksIndices();
        console.log(
          "currentIndices just before regeneration is: ",
          currentIndices,
        );
        console.log("newly generated piece matrix is: ", newIndices);
        // New floating bricks are generated after the current floating piece hits a floored cell
        checkFloatingBrickInTopRow();
        expect(brickCheck).toBe(true);
      });
    });

    test("Pressing the 'start' button pauses the game", () => {
      expect(stateVar.paused).toBe(false);
      docElems.startButton.dispatchEvent(new Event("click"));
      expect(stateVar.paused).toBe(true);
      docElems.startGameModalDOM.dispatchEvent(new Event("hidden.bs.modal"));
      expect(stateVar.paused).toBe(false);
    });

    test("dragging mouse beyond threshold values triggers linear movements", () => {
      // let currentIndices = findFloatingBricksIndices();
      const spy = jest.spyOn(document, "dispatchEvent");

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
      );

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mouseup", { clientX: 60, clientY: 0 }),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "keydown", key: "ArrowRight" }),
      );

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 60, clientY: 0 }),
      );

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mouseup", { clientX: 0, clientY: 0 }),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "keydown", key: "ArrowLeft" }),
      );

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 0 }),
      );

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mouseup", { clientX: 0, clientY: 60 }),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "keydown", key: "ArrowDown" }),
      );

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mousedown", { clientX: 0, clientY: 60 }),
      );

      docElems.mainGridContainer.dispatchEvent(
        new MouseEvent("mouseup", { clientX: 0, clientY: 0 }),
      );

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "keydown", key: "ArrowUp" }),
      );

      spy.mockRestore();
    });

    // test("dragging touch screen beyond threshold values triggers linear movements", () => {
    //   // let currentIndices = findFloatingBricksIndices();
    //   const spy = jest.spyOn(document, "dispatchEvent");

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchstart", {touches[0]: { clientX: 0, clientY: 0 }}),
    //   );

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchend", { touches[0]:{clientX: 60, clientY: 0 }}),
    //   );

    //   expect(spy).toHaveBeenCalledWith(
    //     expect.objectContaining({ type: "keydown", key: "ArrowRight" }),
    //   );

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchstart", { touches[0]:{clientX: 60, clientY: 0 }}),
    //   );

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchend", { touches[0]:{clientX: 0, clientY: 0 }}),
    //   );

    //   expect(spy).toHaveBeenCalledWith(
    //     expect.objectContaining({ type: "keydown", key: "ArrowLeft" }),
    //   );

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchstart", { touches[0]:{clientX: 0, clientY: 0 }}),
    //   );

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchend", { touches[0]:{clientX: 0, clientY: 60 }}),
    //   );

    //   expect(spy).toHaveBeenCalledWith(
    //     expect.objectContaining({ type: "keydown", key: "ArrowDown" }),
    //   );

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchstart", { touches[0]:{clientX: 0, clientY: 60 }}),
    //   );

    //   docElems.mainGridContainer.dispatchEvent(
    //     new TouchEvent("touchend", { touches[0]:{clientX: 0, clientY: 0 }}),
    //   );

    //   expect(spy).toHaveBeenCalledWith(
    //     expect.objectContaining({ type: "keydown", key: "ArrowUp" }),
    //   );

    //   spy.mockRestore();
    // });
  });
});
