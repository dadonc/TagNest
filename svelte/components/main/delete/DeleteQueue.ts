import { get } from "svelte/store";
import {
  type SingleItem,
  deleteItem,
  deleteItemsStore,
  refreshDisplayedItems,
  items,
  getItems,
} from "../../../stores/items";
import { contextMenuStore, settingsJson } from "../../../stores/stateStore";
import { extractNameAndExtension } from "../../../../src/gschert";

const deleteSteps = {
  video: {
    1: async (item: SingleItem) => {
      if (item.name) {
        const $savePath = get(settingsJson).savePath;
        const previewImgPath =
          $savePath + "/previews/videos/" + item.video?.thumbImageName;
        await window.electron.deleteFile(previewImgPath);
        console.log(item.name, ": deleted preview image.");
      }
    },
    2: async (item: SingleItem) => {
      if (item.name) {
        const $savePath = get(settingsJson).savePath;
        const previewPath =
          $savePath +
          "/previews/videos/" +
          extractNameAndExtension(item.name).name +
          "_preview.mp4";
        await window.electron.deleteFile(previewPath);
        console.log(item.name, ": deleted preview video.");
      }
    },
  },
  bookmark: {
    1: async (item: SingleItem) => {
      if (item.bookmark?.screenshotPath) {
        window.electron.deleteFile(item.bookmark?.screenshotPath);
      }
    },
    2: async (item: SingleItem) => {
      if (
        item.bookmark?.previewImagePath &&
        item.bookmark?.previewImagePath !== item.bookmark?.screenshotPath
      ) {
        window.electron.deleteFile(item.bookmark?.previewImagePath);
      }
    },
    3: async (item: SingleItem) => {
      if (item.bookmark?.faviconPath) {
        // check if not other icon is using the same favicon
        const $items = get(items);
        const otherItems = $items.filter(
          (item_) =>
            item_.id !== item.id &&
            item_.bookmark?.faviconPath === item.bookmark?.faviconPath
        );
        if (otherItems.length === 0) {
          window.electron.deleteFile(item.bookmark?.faviconPath);
        }
      }
    },
  },
};

let isRunning = false;
export async function startDeleteTasks() {
  if (isRunning) return;
  isRunning = true;
  let $deleteItems = get(deleteItemsStore);
  if ($deleteItems.length === 0) {
    isRunning = false;
    return;
  }
  for (let i = 0; i < $deleteItems.length; i++) {
    const item = $deleteItems[i];
    // TODO research tsc - see importQueue.ts
    //@ts-ignore
    if (deleteSteps[item.type]) {
      //@ts-ignore
      const stepCount = Object.keys(deleteSteps[item.type]).length;
      for (let step = 1; step <= stepCount; step++) {
        if (item.deleteStep <= step) {
          try {
            //@ts-ignore
            await deleteSteps[item.type][step](item);
          } catch (err) {
            console.log(err);
          }
          item.deleteStep = step;
        }
      }
    }
    item.allStepsRun = true;
    // delete file
    if (item.file) {
      try {
        await window.electron.deleteFile(item.file.path);
        console.log(item.name, ": deleted file.");
      } catch (err) {
        console.log(err);
      }
    }
    // delete item from db
    await deleteItem(item.id);
  }
  $deleteItems = $deleteItems.filter((item) => !item.allStepsRun);
  let $currentDeleteItems = get(deleteItemsStore);
  $currentDeleteItems = $currentDeleteItems.filter(
    (item) =>
      $deleteItems.some((item_) => item_.id !== item.id) || !item.allStepsRun
  );
  deleteItemsStore.set($currentDeleteItems);
  if ($currentDeleteItems.length > 0) {
    setTimeout(() => {
      isRunning = false;
      startDeleteTasks();
    }, 1000);
  } else {
    isRunning = false;
  }
  refreshDisplayedItems("delete");
}

export function confirmDelete(ids: string[]) {
  if (ids.length === 0) return;
  const $contextMenuStore = get(contextMenuStore);
  $contextMenuStore.idsToDelete = ids;
  $contextMenuStore.isDeleteModalOpen = true;
  contextMenuStore.set($contextMenuStore);
}

export async function addToDeleteQueue(ids: string[]) {
  const $deleteItems = get(deleteItemsStore);
  const $items = await getItems({ includeUnfinished: true });
  const itemsToDelete = $items.filter((item) => ids.includes(item.id));
  itemsToDelete.forEach((item) => {
    if (!$deleteItems.some((deleteItem) => deleteItem.id === item.id)) {
      $deleteItems.push({
        ...item,
        deleteStep: 0,
      });
    }
  });
  deleteItemsStore.set($deleteItems);
  startDeleteTasks();
}
