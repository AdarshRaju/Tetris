import * as docElems from "../../../globalVariables/docElems.js";

import stateVar from "../../../globalVariables/stateVars.js";

const { setUpIndependentEventListeners, setUpDependentEventListeners } =
  await import("../../../eventListeners/directEventLists.js");

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
  const gridItems = document.getElementsByClassName("gridItem");
  test("before clicking on form submit, no gridItems are generated", () => {
    expect(gridItems.length).toBe(0);
    expect(stateVar.gameOver).toBe(true);
    expect(stateVar.paused).toBe(false);
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
      expect(gridItems.length).toBe(0);
      expect(stateVar.gameOver).toBe(true);
      expect(stateVar.paused).toBe(false);
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

    test("Atleast one of the DOM cells in the top most row of the board will have a 'floatingBrick' class in it", () => {
      checkFloatingBrickInTopRow();
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
  });
});
