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

export type CurrViewType = {
  zoomLvl: number;
};
