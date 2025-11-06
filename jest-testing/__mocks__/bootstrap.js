// eslint-disable-next-line import/prefer-default-export
import { jest } from "@jest/globals";

export const Modal = jest.fn().mockImplementation(() => {
  return { show: jest.fn(), hide: jest.fn() };
});
