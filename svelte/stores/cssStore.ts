import { writable } from "svelte/store";
import type { CssContainerType } from "../Types";

const left = localStorage.getItem("leftContainer");
export const leftContainer = writable<CssContainerType>(
  left
    ? JSON.parse(left)
    : {
        val: "200px",
        currentVal: "200px",
      }
);

const right = localStorage.getItem("rightContainer");
export const rightContainer = writable<CssContainerType>(
  right
    ? JSON.parse(right)
    : {
        val: "200px",
        currentVal: "200px",
      }
);

const bottom = localStorage.getItem("bottomContainer");
export const bottomContainer = writable<CssContainerType>(
  bottom
    ? JSON.parse(bottom)
    : {
        val: "200px",
        currentVal: "200px",
      }
);

const top = localStorage.getItem("topContainer");
export const topContainer = writable<CssContainerType>(
  top
    ? JSON.parse(top)
    : {
        val: "3.5rem",
        currentVal: "3.5rem",
      }
);
