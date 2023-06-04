import { get } from "svelte/store";
import {
  deleteItems,
  importItems,
  refreshDisplayedItems,
  type SingleItem,
} from "./stores/items";
import {
  currentRoute,
  currView,
  filteredData,
  selectedItems,
} from "./stores/stateStore";
import { leftContainer, rightContainer, topContainer } from "./stores/cssStore";
import { extractNameAndExtension } from "../src/gschert";

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
    exitFakeFullscreen();
    currentRoute.set("main");
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
    const video = document.getElementById("videoPlayer") as HTMLVideoElement;
    if (video && !video.paused) return;
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
    const video = document.getElementById("videoPlayer") as HTMLVideoElement;
    if (video && !video.paused) return;
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

export async function saveVideoPreviewImage(filePath: string) {
  const video = document.getElementById("previewVideo") as HTMLVideoElement;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL("image/jpeg", 0.5);
  const name = extractNameAndExtension(filePath).name + "_thumb.jpeg";
  await window.electron.saveVideoPreviewImage(dataURL, name);
  return true;
}

export async function toggleFakeFullscreen() {
  const isFullscreen = get(topContainer).currentVal === "0rem";
  if (isFullscreen) {
    exitFakeFullscreen();
  } else {
    enterFakeFullscreen();
  }
}

export function exitFakeFullscreen() {
  const isFullscreen = get(topContainer).currentVal === "0rem";
  if (isFullscreen) {
    topContainer.update((container) => {
      return { ...container, currentVal: container.val };
    });
    rightContainer.update((container) => {
      return { ...container, currentVal: container.val };
    });
    leftContainer.update((container) => {
      return { ...container, currentVal: container.val };
    });
    document.documentElement.style.setProperty("--bottomDividerHeight", "2rem");
    document.documentElement.style.setProperty("--bottomAreaPadding", "0.5rem");
  }
}

function enterFakeFullscreen() {
  window.electron.enterFullscreen();
  topContainer.update((container) => {
    return { ...container, currentVal: "0rem" };
  });
  rightContainer.update((container) => {
    return {
      ...container,
      currentVal: "0rem",
    };
  });
  leftContainer.update((container) => {
    return {
      ...container,
      currentVal: "0rem",
    };
  });
  document.documentElement.style.setProperty("--bottomDividerHeight", "0.5rem");
  document.documentElement.style.setProperty("--bottomAreaPadding", "0rem");
}
