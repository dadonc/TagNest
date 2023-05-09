import { get } from "svelte/store";
import {
  finishItemImport,
  importItems,
  type SingleItem,
} from "../../../stores/items";
import { currView } from "../../../stores/stateStore";

export const importSteps = {
  external: {
    count: 3,
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

  const queue = get(importItems).filter((item) => {
    if (item.type in importSteps) {
      return (
        // TODO ask Chris - how to type this
        //@ts-ignore
        item.importStep !== 0 && item.importStep < importSteps[item.type].count
      );
    } else {
      if (item.importStep !== 0) finishItemImport(item.id, 0);
      return false;
    }
  });

  async function startTasks() {
    while (currentTasks < maxTasks && queue.length > 0) {
      const item = queue.shift();
      // TODO ask Chris - why is this check needed
      if (item) {
        currentTasks++;
        //@ts-ignore
        for (let i = item.importStep; i < importSteps[item.type].count; i++) {
          //@ts-ignore
          await importSteps[item.type][item.importStep](item);
          importItems.update((items) => {
            const index = items.findIndex((i) => i.id === item.id);
            items[index].importStep = item.importStep + 1;
            return items;
          });
        }
        //@ts-ignore
        await finishItemImport(item.id, importSteps[item.type].count);
        currentTasks--;
        startTasks();
      }
    }
    if (get(currView).route === "importMultiple") {
      currView.update((view) => {
        return {
          ...view,
          route: "main",
        };
      });
    }
  }

  await startTasks();
  isRunning = false;
}
