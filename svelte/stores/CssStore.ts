import { writable } from "svelte/store";
import type { CssContainerType } from "../Types";

export const leftContainer = writable<CssContainerType>();
export const rightContainer = writable<CssContainerType>();
export const bottomContainer = writable<CssContainerType>();
export const topContainer = writable<CssContainerType>();
