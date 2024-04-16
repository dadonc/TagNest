import { get } from "svelte/store";
import { importItems, items, type SingleItem } from "./stores/items";
import {
  contextMenuStore,
  currentRoute,
  currView,
  filteredData,
  selectedItems,
  type possibleContextMenus,
} from "./stores/stateStore";
import { leftContainer, rightContainer, topContainer } from "./stores/cssStore";
import { extractNameAndExtension } from "../src/gschert";
import { confirmDelete } from "./components/main/delete/DeleteQueue";
import { tick } from "svelte";

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
export const handleKeydownImportView = async (
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
    confirmDelete($selectedItems.ids);
    if (useImportItems) {
      importItems.update((items) =>
        items.filter((item) => !$selectedItems.ids.includes(item.id))
      );
    }
    $selectedItems.ids = [];
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
    confirmDelete($selectedItems.ids);

    // await if item was deleted, if yes the next item should be focused
    listenToStoreOnce(contextMenuStore, (value) => {
      if (value.idsToDelete.length === 0) {
        const lastItemToDeleteIndex = items.findIndex(
          (item) =>
            item.id === $selectedItems.ids[$selectedItems.ids.length - 1]
        );
        if (lastItemToDeleteIndex) {
          if (lastItemToDeleteIndex + step < items.length) {
            $selectedItems.ids = [items[lastItemToDeleteIndex + step].id];
          } else {
            if (items[0]) $selectedItems.ids = [items[0].id];
          }
        }
      }
    });
  } else if (e.key === "ArrowLeft") {
    const video = document.getElementById("videoPlayer") as HTMLVideoElement;
    if (video && !video.paused) return;
    if (video && video.paused) {
      if (e.metaKey) {
        video.play();
        return;
      }
    }
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
    if (video && video.paused) {
      if (e.metaKey) {
        video.play();
        return;
      }
    }
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

export async function saveVideoThumbImage(filePath: string) {
  const video = document.getElementById("previewVideo") as HTMLVideoElement;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL("image/jpeg", 0.5);
  const name = extractNameAndExtension(filePath).name as string;
  const newPreviewName = name + Date.now() + "_thumb.jpeg";
  await window.electron.saveVideoPreviewImage(dataURL, newPreviewName);
  return newPreviewName;
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
  // window.electron.enterFullscreen();
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

export function getPxfromRem(rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export function formatTime(seconds: number) {
  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().split("T")[1].split(".")[0];
}

export function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

export function getVideoResolutionDescription(width: number, height: number) {
  let w = width;
  let h = height;
  if (width < height) {
    w = height;
    h = width;
  }
  if (w <= 320 || h <= 240) {
    return "240p";
  } else if (w <= 480 || h <= 360) {
    return "360p";
  } else if (w <= 640 || h <= 480) {
    return "480p";
  } else if (w <= 1280 || h <= 720) {
    return "720p";
  } else if (w <= 1920 || h <= 1080) {
    return "1080p";
  } else if (w <= 2560 || h <= 1440) {
    return "1440p";
  } else if (w <= 3840 || h <= 2160) {
    return "4K";
  } else if (w <= 7680 || h <= 4320) {
    return "8K";
  }
}

export function indexOfAlreadyExistingItem(newPath: string) {
  const { name: newName, extension: newExtension } =
    extractNameAndExtension(newPath);
  const index = get(items).findIndex((otherItem) => {
    // TODO - check file size!
    // TODO rename if file size differs but names are the same
    if (otherItem.file?.path) {
      const { name: otherItemName, extension: otherItemExtension } =
        extractNameAndExtension(otherItem.file.path);
      return otherItemName === newName && otherItemExtension === newExtension;
    }
  });
  return index;
}

export function itemAlreadyExists(newPath: string) {
  const index = indexOfAlreadyExistingItem(newPath);
  return index !== -1;
}

// LAYOUT

export const toggleRight = () => {
  const $rightContainer = get(rightContainer);
  if ($rightContainer.currentVal === "0px") {
    if ($rightContainer.val === "0px") {
      $rightContainer.val = "200px";
    }
    $rightContainer.currentVal = $rightContainer.val;
  } else {
    $rightContainer.currentVal = "0px";
  }
  rightContainer.set($rightContainer);
};

export const toggleLeft = () => {
  const $leftContainer = get(leftContainer);
  if ($leftContainer.currentVal === "0px") {
    if ($leftContainer.val === "0px") {
      $leftContainer.val = "200px";
    }
    $leftContainer.currentVal = $leftContainer.val;
  } else {
    $leftContainer.currentVal = "0px";
  }
  leftContainer.set($leftContainer);
};

export const possibylCloseContextMenu = (e: MouseEvent) => {
  if (e && e.target) {
    const target = e.target as HTMLElement;
    if (target.matches("#contextMenu, #contextMenu *")) {
      return false;
    }
  }
  const menuStore = get(contextMenuStore);
  menuStore.isContextMenuOpen = false;
  contextMenuStore.set(menuStore);
};

export function convertFileSize(bytes: number) {
  const sizeInKB = bytes / 1024;
  const sizeInMB = bytes / (1024 * 1024);
  const sizeInGB = bytes / (1024 * 1024 * 1024);

  if (sizeInGB >= 1) {
    return sizeInGB.toFixed(2) + " GB";
  } else if (sizeInMB >= 1) {
    return sizeInMB.toFixed(2) + " MB";
  } else if (sizeInKB >= 1) {
    return sizeInKB.toFixed(2) + " KB";
  } else {
    return bytes + " B";
  }
}

function listenToStoreOnce(store: any, callback: (value: any) => void) {
  let called = false;
  const unsubscribe = store.subscribe((value: any) => {
    if (called) {
      callback(value);
      unsubscribe();
    }
    called = true;
  });
}

export function isElementInViewport(el: HTMLElement) {
  // https://stackoverflow.com/a/7557433
  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

export async function updateItemPreviews(id: string, previewPath?: string) {
  await tick();
  setTimeout(() => {
    const temp = document.getElementsByClassName(id + "_preview");
    if (!previewPath) {
      previewPath = temp[0].getAttribute("src") as string;
    }
    for (let i = 0; i < temp.length; i++) {
      temp[i].setAttribute("src", previewPath + "?" + new Date().getTime());
    }
  }, 0);
}

export function openContextMenu(event: MouseEvent, type: possibleContextMenus) {
  event.stopPropagation();
  event.preventDefault();
  const $contextMenuStore = get(contextMenuStore);
  $contextMenuStore.x = event.clientX;
  $contextMenuStore.y = event.clientY;
  $contextMenuStore.isContextMenuOpen = true;
  $contextMenuStore.openContextMenu = type;
  contextMenuStore.set($contextMenuStore);
}
