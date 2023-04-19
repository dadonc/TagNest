import { writable } from "svelte/store";

// export type CurrViewActionsType = "link" | "";
// export type CurrViewDetailsType = "mhtml" | "image" | "readability" | "video";

type CurrViewType = {
  zoomLvl: number;
  // selectionType: "grid";
  // route: "main" | "detail";
  // detailsType: CurrViewDetailsType;
  // focusedAction?: CurrViewActionsType;
};

const emptyCurrView: CurrViewType = {
  zoomLvl: 3,
  // selectionType: "grid",
  // route: "main",
  // detailsType: "image",
};

const currentCurrView = localStorage.getItem("currView");
export const currView = writable<CurrViewType>(
  currentCurrView ? JSON.parse(currentCurrView) : emptyCurrView
);
