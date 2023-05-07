import { get } from "svelte/store";
import {
  deleteItems,
  importItems,
  refreshDisplayedItems,
  type SingleItem,
} from "./stores/items";
import { currView, filteredData, selectedItems } from "./stores/stateStore";

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

export const deselectItems = () => {
  selectedItems.set({ ids: [] as string[] });
};

// todo use this in all locations
export const handleKeydown = async (
  e: KeyboardEvent,
  useImportItems: boolean = false
) => {
  if (
    document.activeElement?.tagName === "INPUT" ||
    document.activeElement?.tagName === "TEXTAREA" ||
    //@ts-ignore
    document.activeElement?.isContentEditable
  ) {
    return;
  }
  const $selectedItems = get(selectedItems);
  const items = useImportItems
    ? get(importItems)
    : (await get(filteredData)).items;

  const step = useImportItems ? 1 : get(currView).zoomLvl;
  if (e.key === "Escape") {
    deselectItems();
  } else if (e.key === "Backspace" && e.metaKey) {
    await deleteItems($selectedItems.ids);
    if (useImportItems) {
      importItems.update((items) =>
        items.filter((item) => !$selectedItems.ids.includes(item.id))
      );
    }
    $selectedItems.ids = [];
    refreshDisplayedItems();
  } else if (e.key === "ArrowUp") {
    if ($selectedItems.ids.length == 1) {
      const item = items.find((item) => item.id === $selectedItems.ids[0]);
      if (item) {
        const index = items.indexOf(item);
        if (index - step >= 0) {
          $selectedItems.ids = [items[index - step].id];
        }
      }
    }
  } else if (e.key === "ArrowDown") {
    if ($selectedItems.ids.length == 1) {
      const item = items.find((item) => item.id === $selectedItems.ids[0]);
      if (item) {
        const index = items.indexOf(item);
        if (index + step < items.length) {
          $selectedItems.ids = [items[index + step].id];
        }
      }
    }
  } else if (e.key === "a" && e.metaKey) {
    e.preventDefault();
    $selectedItems.ids = items.map((item) => item.id);
  }
  selectedItems.set($selectedItems);
};

export const handleKeydownDetailsView = async (e: KeyboardEvent) => {
  if (
    document.activeElement?.tagName === "INPUT" ||
    document.activeElement?.tagName === "TEXTAREA" ||
    //@ts-ignore
    document.activeElement?.isContentEditable
  ) {
    return;
  }

  const $selectedItems = get(selectedItems);
  const items = (await get(filteredData)).items;

  const step = 1;
  if (e.key === "Escape") {
    currView.update((view) => ({ ...view, route: "main" }));
  } else if (e.key === "Backspace" && e.metaKey) {
    const item = items.find(
      (item) => item.id === $selectedItems.ids[$selectedItems.ids.length - 1]
    );
    if (item) {
      const index = items.indexOf(item);
      if (index + step < items.length) {
        $selectedItems.ids = [items[index + step].id];
      }
    }
    await deleteItems($selectedItems.ids);
    refreshDisplayedItems();
  } else if (e.key === "ArrowLeft") {
    if ($selectedItems.ids.length == 1) {
      const item = items.find((item) => item.id === $selectedItems.ids[0]);
      if (item) {
        const index = items.indexOf(item);
        if (index - step >= 0) {
          $selectedItems.ids = [items[index - step].id];
        } else {
          $selectedItems.ids = [items[items.length - 1].id];
        }
      }
    }
  } else if (e.key === "ArrowRight") {
    if ($selectedItems.ids.length == 1) {
      const item = items.find((item) => item.id === $selectedItems.ids[0]);
      if (item) {
        const index = items.indexOf(item);
        if (index + step < items.length) {
          $selectedItems.ids = [items[index + step].id];
        } else {
          $selectedItems.ids = [items[0].id];
        }
      }
    }
  } else if (e.key === "a" && e.metaKey) {
    e.preventDefault();
    $selectedItems.ids = items.map((item) => item.id);
  }
  document.getElementById($selectedItems.ids[0])?.scrollIntoView();
  selectedItems.set($selectedItems);
};
