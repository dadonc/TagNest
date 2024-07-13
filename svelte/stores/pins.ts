import { get, writable } from "svelte/store";
import { getItem } from "./items";

export type Pin = {
  name: string;
  currentRoute: "details" | "main";
  itemId?: string;
};

const defaultPin: Pin = {
  name: "Home",
  currentRoute: "main",
};

const currentPins = localStorage.getItem("pins");

export const pins = writable<Pin[]>(
  currentPins ? JSON.parse(currentPins) : [defaultPin]
);

export async function addPin(itemId: string) {
  const alreadyExists = get(pins).some((pin) => pin.itemId === itemId);
  if (alreadyExists) {
    return;
  }
  const name = (await getItem(itemId))?.name || "Unknown";
  pins.update((t) => {
    t.push({ itemId, name, currentRoute: "details" });
    return t;
  });
}
