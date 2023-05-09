import type { ExposedInMainWorld } from "../src/preload";
declare global {
  interface Window {
    electron: ExposedInMainWorld;
  }
}

export type CssContainerType = {
  val: string;
  currentVal: string;
};
