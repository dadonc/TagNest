import { get } from "svelte/store";
import {
  finishItemImport,
  importItems,
  refreshDisplayedItems,
  updateFilePath,
  type SingleItem,
  type ImportItem,
} from "../../../stores/items";
import { currentRoute, settingsJson } from "../../../stores/stateStore";
import { extractNameAndExtension } from "../../../../src/gschert";

export const importSteps = {
  // bookmark import steps are run before the bookmark is created
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
      const { name, extension } = extractNameAndExtension(item.name!);
      // check if already exists
      try {
        const res = await fetch(
          "file://" + $savePath + "/previews/videos/" + name + "_thumb.jpeg",
          { method: "HEAD" }
        );
        if (res.ok) {
          console.log("preview already exists");
          return;
        }
      } catch (err) {}
      const video = document.createElement("video");
      video.src =
        "file://" +
        $savePath +
        "/previews/videos/" +
        name +
        "_preview." +
        extension;
      video.load();
      video.addEventListener(
        "canplay",
        () => {
          video.currentTime = 0;
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas
            .getContext("2d")
            ?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL("image/jpeg", 0.5);
          window.electron.saveVideoPreviewImage(dataURL, name + "_thumb.jpeg");
        }
        // { once: true } - black image bug?
      );
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
      const correctStep =
        item.importStep !== -1 && item.importStep <= stepCount;
      const wasUpdatedRecently = item.lastImportStepUpdate
        ? item.lastImportStepUpdate < Date.now() - 5 * 60 * 1000
        : false;
      return correctStep && !wasUpdatedRecently;
    });
  }

  let queue: ImportItem[] = [];
  let wasRunning = false;

  async function startTasks() {
    queue = fillQueue();
    if (queue.length === 0) {
      isRunning = false;
      return;
    }
    console.log("start import tasks");

    let promises = [];
    while (queue.length > 0) {
      wasRunning = true;
      while (currentTasks < maxTasks && queue.length > 0) {
        const item = queue.shift();
        if (item) promises.push(runItemTasks(item));
      }
      await Promise.all(promises); // why doesn't Promise.any not work?
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

  async function runItemTasks(item: ImportItem) {
    console.log("run item tasks", item.name);
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
        console.log("run step", i, "of", item.name);
        //@ts-ignore
        if (importSteps[item.type] && importSteps[item.type][item.importStep]) {
          //@ts-ignore
          await importSteps[item.type][item.importStep](item);
        }
        console.log("finished step", item.importStep, "of", item.name);
        importItems.update((items) => {
          const index = items.findIndex((i) => i.id === item.id);
          items[index].importStep++;
          items[index].lastImportStepUpdate = Date.now();
          return items;
        });
      }
      await finishItemImport(item.id, stepCount);
      currentTasks--;
    }
  }

  startTasks();
}

async function runCombineBehavior(item: ImportItem) {
  if (!item.file) return item;
  const combineBehavior = get(settingsJson).combineBehavior;
  if (combineBehavior === "separate" || item.type === "bookmark") {
    item.importStep = 1;
    return item;
  }
  const $savePath = get(settingsJson).savePath;
  const { name, extension } = extractNameAndExtension(item.name!);
  const newPath = $savePath + "/" + name + "." + extension;
  const oldPath = item.file.path;
  if (combineBehavior === "copy") {
    await window.electron.copyFile(oldPath, newPath);
  } else if (combineBehavior === "move") {
    await window.electron.moveFile(oldPath, newPath);
  }
  item.importStep = 1;
  await updateFilePath(item.id, newPath);
  return item;
}
