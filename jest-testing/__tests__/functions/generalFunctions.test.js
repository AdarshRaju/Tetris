// The module imported below contains the general functions that can be used anywhere
import { describe } from "@jest/globals";
import { rotateMatrixClockwise } from "../../../functions/generalFunctions.js";
// The module imported below contains the various tetris pieces used in the game
import * as tetrisPieces from "../../../globalVariables/tetrisPieces.js";



describe('Matrix rotation functions', () =>{

  test("Rotates a O piece once in the clockwise direction", () => {
  expect(rotateMatrixClockwise(tetrisPieces.OPieceMatrix)).toEqual([
    [true, true],
    [true, true],
    ]);
  });

  test("Rotates a I piece once in the clockwise direction", () => {
    expect(rotateMatrixClockwise(tetrisPieces.IPieceMatrix)).toEqual([
      [true, true, true, true],
    ]);
  });

})