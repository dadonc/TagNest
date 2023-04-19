import { writable } from "svelte/store";

type StateStoreType = {
  selectedItems: string[];
};

const emptyStateStore: StateStoreType = {
  selectedItems: [],
};

export const state = writable<StateStoreType>(emptyStateStore);
