// await jest.unstable_mockModule("@functions/generalFunctions.js", () => ({
//   preLoadSoundFile: jest.fn(),
//   toggleMusic: jest.fn(),
//   toggleSounds: jest.fn(),
//   toggleCustomDisplay: jest.fn(),
// }));

import * as docElems from "../../../globalVariables/docElems.js";

// const {
//   preLoadSoundFile,
//   toggleMusic,
//   toggleSounds,
//   // toggleCustomDisplay,
// } = await import("@functions/generalFunctions.js");
const { setUpIndependentEventListeners } = await import(
  "../../../eventListeners/directEventLists.js"
);

describe("testing independent event listeners", () => {
  setUpIndependentEventListeners();
  // test("the relevant sound files are being used", () => {
  //   window.dispatchEvent(new Event("load"));

  //   // expect(preLoadSoundFile).toHaveBeenCalledWith(docElems.newHighScoreSound);
  //   // expect(preLoadSoundFile).toHaveBeenCalledTimes(7);
  // });

  // test("clicking music button is triggering music toggle logic", () => {
  //   docElems.musicTriggerBtn.dispatchEvent(new Event("click"));

  //   // expect(toggleMusic).toHaveBeenCalled();
  // });

  // test("clicking sound button is triggering sound toggle logic", () => {
  //   docElems.soundTriggerBtn.dispatchEvent(new Event("click"));

  //   // expect(toggleSounds).toHaveBeenCalled();
  // });

  describe("testing 'custom' entries input field", () => {
    test("selecting drop-down values other than 'custom' no of columns for tetris board selection logic", () => {
      docElems.noOfColsSel.value = "5";
      const change = new Event("change");
      docElems.noOfColsSel.dispatchEvent(change);

      // expect(toggleCustomDisplay).toHaveBeenCalled();
      // expect(toggleCustomDisplay).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     target: expect.objectContaining({
      //       value: "5",
      //     }),
      //   }),
      //   docElems.customColsSel,
      //   docElems.labelCustomColsSel,
      //   docElems.customColInvalidFeedback,
      // );

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

      // expect(toggleCustomDisplay).toHaveBeenCalled();
      // expect(toggleCustomDisplay).toHaveBeenCalledWith(
      //   expect.objectContaining({
      //     target: expect.objectContaining({
      //       value: "custom",
      //     }),
      //   }),
      //   docElems.customColsSel,
      //   docElems.labelCustomColsSel,
      //   docElems.customColInvalidFeedback,
      // );
      // console.log(change);

      expect(docElems.customColsSel.hidden).toBe(false);
      expect(docElems.customColsSel.disabled).toBe(false);
      expect(docElems.customColsSel.required).toBe(false);
      expect(docElems.labelCustomColsSel.hidden).toBe(false);
      expect(docElems.customColInvalidFeedback.hidden).toBe(false);
    });
  });
});
