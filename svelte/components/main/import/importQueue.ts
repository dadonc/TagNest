import { get } from "svelte/store";
import {
  finishItemImport,
  importItems,
  refreshDisplayedItems,
  updateFilePath,
  type SingleItem,
} from "../../../stores/items";
import { currentRoute, settingsJson } from "../../../stores/stateStore";
import { extractNameAndExtension } from "../../../../src/gschert";

export const importSteps = {
  video: {
    1: async (item: SingleItem) => {
      await window.electron.createVideoPreview(item.file!.path, item.id);
      console.log("Created video preview:", item.name);
    },
    2: async (item: SingleItem) => {
      await window.electron.saveVideoDetailsToItem(item.file!.path, item.id);
    },
    3: async (item: SingleItem) => {
      // create video preview thumbnail
      const $savePath = get(settingsJson).savePath;
      const itemName = extractNameAndExtension(item.name!).name;
      // check if already exists
      try {
        const res = await fetch(
          "file://" +
            $savePath +
            "/previews/videos/" +
            itemName +
            "_thumb.jpeg",
          { method: "HEAD" }
        );
        if (res.ok) return;
      } catch (err) {}
      const video = document.createElement("video");
      const extension = item.name?.split(".")[1];
      video.src =
        "file://" +
        $savePath +
        "/previews/videos/" +
        itemName +
        "_preview." +
        extension;
      video.load();
      video.addEventListener("canplay", () => {
        video.currentTime = 0.1;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL("image/jpeg", 0.5);
        window.electron.saveVideoPreviewImage(
          dataURL,
          itemName + "_thumb.jpeg"
        );
      });
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

  function fillQueue() {
    return get(importItems).filter((item) => {
      // TODO ask Chris - how to type this
      //@ts-ignore
      const stepCount = importSteps[item.type]
        ? //@ts-ignore
          Object.keys(importSteps[item.type]).length
        : 0;
      return item.importStep !== -1 && item.importStep <= stepCount;
    });
  }

  let queue: SingleItem[] = [];
  let wasRunning = false;

  async function startTasks() {
    queue = fillQueue();

    while (queue.length > 0) {
      wasRunning = true;
      while (currentTasks < maxTasks && queue.length > 0) {
        const item = queue.shift();
        if (item) runItemTasks(item);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    queue = fillQueue();
    if (queue.length > 0) {
      startTasks();
    } else {
      isRunning = false;
      if (wasRunning) {
        wasRunning = false;
        refreshDisplayedItems("finishedItemsImport");
      }
      if (get(currentRoute) === "importMultiple") {
        currentRoute.set("main");
      }
    }
  }

  async function runItemTasks(item: SingleItem) {
    //@ts-ignore
    const stepCount = importSteps[item.type]
      ? //@ts-ignore
        Object.keys(importSteps[item.type]).length
      : 0;
    // TODO ask Chris - why is this check needed
    if (item) {
      currentTasks++;
      if (item.importStep === 0) {
        item = await runCombineBehavior(item);
      }
      for (let i = item.importStep; i <= stepCount; i++) {
        //@ts-ignore
        await importSteps[item.type][item.importStep](item);
        importItems.update((items) => {
          const index = items.findIndex((i) => i.id === item.id);
          items[index].importStep++;
          return items;
        });
      }
      await finishItemImport(item.id, stepCount);
      currentTasks--;
    }
  }

  startTasks();
}

async function runCombineBehavior(item: SingleItem) {
  const combineBehavior = get(settingsJson).combineBehavior;
  if (combineBehavior === "separate" || item.type === "bookmark") {
    item.importStep = 1;
    return item;
  }
  const $savePath = get(settingsJson).savePath;
  const { name, extension } = extractNameAndExtension(item.name!);
  const newPath = $savePath + "/" + name + "." + extension;
  const oldPath = item.file!.path;
  if (combineBehavior === "copy") {
    await window.electron.copyFile(oldPath, newPath);
  } else if (combineBehavior === "move") {
    await window.electron.moveFile(oldPath, newPath);
  }
  item.importStep = 1;
  await updateFilePath(item.fileId as string, newPath);
  return item;
}
