import { get } from "svelte/store";
import {
  type SingleItem,
  deleteItem,
  deleteItemsStore,
  refreshDisplayedItems,
} from "../../../stores/items";
import { settingsJson } from "../../../stores/stateStore";
import { extractNameAndExtension } from "../../../../src/gschert";

const deleteSteps = {
  video: {
    1: async (item: SingleItem) => {
      if (item.name) {
        const $savePath = get(settingsJson).savePath;
        const previewImgPath =
          $savePath +
          "/previews/videos/" +
          extractNameAndExtension(item.name).name +
          "_thumb.jpeg";
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
