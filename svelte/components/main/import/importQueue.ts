import { get } from "svelte/store";
import {
  finishItemImport,
  importItems,
  refreshDisplayedItems,
  type SingleItem,
} from "../../../stores/items";
import { currentRoute, currView } from "../../../stores/stateStore";

export const importSteps = {
  video: {
    1: async (item: SingleItem) => {
      await window.electron.createVideoPreview(item.file!.path);
      console.log("Created video preview:", item.name);
    },
    2: async (item: SingleItem) => {
      await window.electron.getVideoDetails(item.file!.path);
      console.log("Got video details:", item.name);
    },
  },
  external: {
    1: async (item: SingleItem) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("step 1:", item.name);
          resolve("step 1");
        }, 3000);
      });
    },

    2: async (item: SingleItem) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("step 2:", item.name);
          resolve("step 2");
        }, 3000);
      });
    },

    3: async (item: SingleItem) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("step 3:", item.name);
          resolve("step 3");
        }, 3000);
      });
    },
  },
};

let isRunning = false;
export default async function startImportTasks() {
  if (isRunning) return;
  isRunning = true;
  let currentTasks = 0;
  const maxTasks = 5;

  let queue = fillQueue();

  function fillQueue() {
    return get(importItems).filter((item) => {
      if (item.type in importSteps) {
        // TODO ask Chris - how to type this
        //@ts-ignore
        const stepCount = Object.keys(importSteps[item.type]).length;
        return item.importStep !== 0 && item.importStep <= stepCount;
      } else {
        if (item.importStep !== 0) finishItemImport(item.id, 0);
        return false;
      }
    });
  }

  function startTasks() {
    while (currentTasks < maxTasks && queue.length > 0) {
      const item = queue.shift();
      if (item) runItemTasks(item);
    }
  }

  async function runItemTasks(item: SingleItem) {
    //@ts-ignore
    const stepCount = Object.keys(importSteps[item.type]).length;
    // TODO ask Chris - why is this check needed
    if (item) {
      currentTasks++;
      for (let i = item.importStep; i <= stepCount; i++) {
        //@ts-ignore
        await importSteps[item.type][item.importStep](item);
        importItems.update((items) => {
          const index = items.findIndex((i) => i.id === item.id);
          items[index].importStep = item.importStep + 1;
          return items;
        });
      }
      await finishItemImport(item.id, stepCount);
      currentTasks--;
      if (queue.length === 0) {
        queue = fillQueue();
      }
      if (queue.length > 0) {
        startTasks();
      } else {
        isRunning = false;
        if (get(currentRoute) === "importMultiple") {
          currentRoute.set("main");
        }
        refreshDisplayedItems("finishedItemsImport");
      }
    }
  }

  startTasks();
}
