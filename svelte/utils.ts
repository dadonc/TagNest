import { get } from "svelte/store";
import { importItems, type SingleItem } from "./stores/items";
import { filteredData, selectedItems } from "./stores/stateStore";

export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// todo use this in all locations
export async function selectItem({
  event,
  currentItem,
  useImportItems = false,
}: {
  event: MouseEvent | KeyboardEvent;
  currentItem: SingleItem;
  useImportItems?: boolean;
}) {
  if ((event.target as HTMLElement).matches(".hoverDisplay, .hoverDisplay *")) {
    return;
  }
  const items = useImportItems
    ? get(importItems)
    : (await get(filteredData)).items;
  const $selectedItems = get(selectedItems);
  const isItemSelected = $selectedItems.ids.includes(currentItem.id);
  event.preventDefault();
  event.stopPropagation();
  if (event.metaKey) {
    isItemSelected
      ? ($selectedItems.ids = $selectedItems.ids.filter(
          (id) => id !== currentItem.id
        ))
      : ($selectedItems.ids = [...$selectedItems.ids, currentItem.id]);
  } else if (event.shiftKey) {
    const itemIndex = items.indexOf(currentItem);
    const firstSelectedItemIndex = items.findIndex(
      (item) => item.id === $selectedItems.ids[0]
    );
    const lastSelectedItemIndex = items.findIndex(
      (item) => item.id === $selectedItems.ids[$selectedItems.ids.length - 1]
    );
    if (itemIndex < firstSelectedItemIndex) {
      $selectedItems.ids = items
        .slice(itemIndex, firstSelectedItemIndex + 1)
        .map((item) => item.id);
    } else if (itemIndex > lastSelectedItemIndex) {
      $selectedItems.ids = items
        .slice(lastSelectedItemIndex, itemIndex + 1)
        .map((item) => item.id);
    } else {
      $selectedItems.ids = items
        .slice(firstSelectedItemIndex, itemIndex + 1)
        .map((item) => item.id);
    }
  } else {
    $selectedItems.ids = [currentItem.id];
  }
  return $selectedItems;
}
