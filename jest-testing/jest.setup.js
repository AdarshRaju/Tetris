import fs from "fs";
import path from "path";
import { jest } from "@jest/globals";

import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const html = fs.readFileSync(path.resolve(dirname, "../index.html"), "utf8");

// JSDOM was initialized in jest.config.js
document.body.innerHTML = html;

global.jest = jest;
global.bootstrap = {
  Modal: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
    hide: jest.fn(),
  })),
};

Object.defineProperty(window.HTMLMediaElement.prototype, "load", {
  configurable: true,
  value: jest.fn().mockImplementation(() => {
    return { preload: "auto" };
  }),
});

Object.defineProperty(window.HTMLMediaElement.prototype, "play", {
  configurable: true,
  value: jest.fn().mockImplementation(() => {
    // preload: "auto",
  }),
});

// Object.defineProperty(window.HTMLAudioElementImpl, "play", {
//   configurable: true,
//   value: jest.fn().mockImplementation(() => {
//     // preload: "auto",
//   }),
// });

Object.defineProperty(window.HTMLAudioElement, "play", {
  configurable: true,
  value: jest.fn().mockImplementation(() => {
    // preload: "auto",
  }),
});

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  value: jest.fn().mockImplementation(() => {
    // preload: "auto",
  }),
});
