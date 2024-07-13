import { get, writable } from "svelte/store";
import { getItem } from "./items";
import { currentRoute, selectedItems } from "./stateStore";

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

export function closePin(itemId?: string) {
  const $selectedItems = get(selectedItems);
  const $currentRoute = get(currentRoute);
  const $pins = get(pins);
  if (
    itemId ||
    ($selectedItems.ids.length === 1 && $currentRoute === "details")
  ) {
    const prevSelectedId = itemId || $selectedItems.ids[0];
    if ($pins.length > 2) {
      if ($currentRoute === "details") {
        let index = $pins.findIndex((pin) => pin.itemId === prevSelectedId);
        // jump right if there is a pin to the right
        if (index < $pins.length - 1) {
          $selectedItems.ids = [$pins[index + 1].itemId || ""];
          selectedItems.set($selectedItems);
        } else {
          // jump left if there is a pin to the left
          $selectedItems.ids = [$pins[index - 1].itemId || ""];
          selectedItems.set($selectedItems);
        }
      }
    } else {
      currentRoute.set("main");
    }
    pins.set($pins.filter((pin) => pin.itemId !== prevSelectedId));
  }
}
