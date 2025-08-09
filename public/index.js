// The module imported below contains all the eventlisteners that are used in the project
import {
  setUpIndependentEventListeners,
  setUpDependentEventListeners,
  setUpTouchControls,
} from "./EventListeners/directEventLists.js";

setUpTouchControls();
setUpIndependentEventListeners();
setUpDependentEventListeners();
