// TODO - This was so often changed haphazardly it is a complete mess. Refactor this whole file
import { get } from "svelte/store";
import {
  finishItemImport,
  importItems,
  refreshDisplayedItems,
  updateFilePath,
  type SingleItem,
  type ImportItem,
  updateVideoThumbImageInDB,
  type ItemCreate,
  createItem,
} from "../../../stores/items";
import { currentRoute, settingsJson } from "../../../stores/stateStore";
import { extractNameAndExtension } from "../../../../src/gschert";
import { itemAlreadyExists } from "../../../utils";

// step -1: import not started
// step 0: runCombineBehavior
// step 1: the first actual import step
// step Object.keys(importSteps[importItem.type]).length is the last actual step
// when done item.importFinished is set to true

// todo: type this?
export const importSteps = {
  // bookmark import steps are run before the bookmark is created - see bookmark.ts and server.ts
  video: {
    1: {
      // Create video preview
      func: async (item: SingleItem) => {
        const savePath = get(settingsJson).savePath;

        try {
          let { name, extension } = extractNameAndExtension(item.file!.path);
          if (!name || !extension) {
            throw new Error(
              "Could not extract name and extension for: " + item.file!.path
            );
          }
          const res = await fetch(
            `file://${savePath}/previews/videos/${encodeURIComponent(
              name
            )}_preview.${extension}`,
            { method: "HEAD" }
          );
          if (res.ok) {
            console.log("preview already exists");
            return;
          }
        } catch (err) {
          await window.electron.createVideoPreview(item.file!.path, item.id);
          console.log("Created video preview:", item.name);
        }
      },
      desc: "Create video preview",
    },
    2: {
      // Save video details
      func: async (item: SingleItem) => {
        return await window.electron.saveVideoDetailsToItem(
          item.file!.path,
          item.id
        );
      },
      desc: "Save video details",
    },
    3: {
      func: async (item: SingleItem) => {
        // create video preview thumbnail
        const savePath = get(settingsJson).savePath;
        const { name, extension } = extractNameAndExtension(item.file!.path);
        if (!name || !extension) {
          throw new Error(
            "Could not extract name and extension for: " + item.file!.path
          );
        }
        // check if already exists
        if (item.video?.thumbImageName) {
          try {
            const res = await fetch(
              `file://${savePath}/previews/videos/${item.video?.thumbImageName}`,
              { method: "HEAD" }
            );
            if (res.ok) {
              console.log("preview already exists");
              return;
            }
          } catch (err) {}
        }

        const video = document.createElement("video");
        video.src =
          "file://" +
          savePath +
          "/previews/videos/" +
          encodeURIComponent(name) +
          "_preview." +
          extension;
        video.load();
        video.currentTime = 0.1;
        await new Promise((resolve) => {
          video.addEventListener("canplay", async () => {
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas
              .getContext("2d")
              ?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataURL = canvas.toDataURL("image/jpeg", 0.5);
            await window.electron.saveVideoPreviewImage(
              dataURL,
              name + "_thumb.jpeg"
            );
            await updateVideoThumbImageInDB(
              item,
              encodeURIComponent(name) + "_thumb.jpeg"
            );
            resolve(true);
          });
        });
      },
      desc: "Create video preview thumbnail",
    },
  },
  audio: {
    1: {
      func: async (item: SingleItem) => {
        await window.electron.saveAudioLengthToItem(item.file!.path, item.id);
        console.log("Saved audio length:", item.name);
      },
      desc: "Get and save audio length",
    },
  },
  text: {
    1: {
      func: async (item: SingleItem) => {
        await window.electron.saveTextInfoToItem(item.file!.path, item.id);
        console.log("Saved text infos to item", item.name);
      },
      desc: "Save text infos",
    },
  },
  external: {
    1: {
      func: async (item: SingleItem) => {
        await window.electron.saveFilePreview(item.file!.path);
      },
      desc: "Save file preview",
    },
  },
  pdf: {
    1: {
      func: async (item: SingleItem) => {
        await window.electron.saveFilePreview(item.file!.path);
      },
      desc: "Save file preview",
    },
    // 2: {
    //   func: async (item: SingleItem) => {
    //     await new Promise((resolve) => setTimeout(resolve, 15000));
    //   },
    //   desc: "Save file preview",
    // },
  },
};

let isRunning = false;
export default async function startImportTasks() {
  if (isRunning) return;
  isRunning = true;
  let currentTasks = 0;
  const maxTasks = 1;

  function fillQueue() {
    return get(importItems).filter((item) => {
      // TODO research tsc - how to type this
      //@ts-ignore
      const stepCount = importSteps[item.type]
        ? //@ts-ignore
          Object.keys(importSteps[item.type]).length
        : 0;
      const correctStep = !item.importFinished && item.importStep <= stepCount;
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
        importItems.update((items) => {
          return items.filter((item) => !item.importFinished);
        });
        refreshDisplayedItems("finishedItemsImport");
      }
      if (get(currentRoute) === "importMultiple") {
        currentRoute.set("main");
      }
    }
  }

  // ImportItem | ItemCreate is a stupid typing hack to get this to work _now_ instead of a larger refactor
  async function runItemTasks(item: ImportItem | ItemCreate) {
    console.log(`importing item: ${item.name}`, item.importStep);

    //@ts-ignore
    const stepCount = importSteps[item.type]
      ? //@ts-ignore
        Object.keys(importSteps[item.type]).length
      : 0;
    // TODO research tsc - why is this check needed
    currentTasks++;
    if (item.importStep === -1) {
      item.importStep = 0;
      item = await runCombineBehavior(item as ItemCreate);
      if (item.importStep === 999) {
        console.log("Item import was aborted.");
        queue = queue.filter((i) => i.tempId !== item.tempId);
        importItems.update((items) => {
          return items.filter((i) => i.tempId !== item.tempId);
        });
        currentTasks--;
        return;
      } else {
        queue = queue.filter((i) => i.tempId !== item.tempId);
        importItems.update((items) => {
          return items.map((i) => {
            if (i.tempId === item.tempId) {
              return item as ImportItem;
            }
            return i;
          });
        });
      }
    }
    item = item as ImportItem;
    for (let i = item.importStep; i <= stepCount; i++) {
      console.log(`run step ${i}/${stepCount} of ${item.name}`);
      //@ts-ignore
      if (importSteps[item.type] && importSteps[item.type][item.importStep]) {
        //@ts-ignore
        await importSteps[item.type][item.importStep].func(item);
      }
      console.log(
        `finished step ${item.importStep}/${stepCount} of ${item.name}`
      );
      try {
        importItems.update((items) => {
          const index = items.findIndex((i) => i.id === item.id);
          items[index].importStep++;
          items[index].lastImportStepUpdate = Date.now();
          return items;
        });
      } catch (err) {
        console.log("Item import was aborted.:", err);
      }
    }

    await finishItemImport(item.id, stepCount);
    currentTasks--;
  }

  startTasks();
}

async function runCombineBehavior(item_: ItemCreate) {
  let item = await possiblyCreateEmptyItem(item_);
  if (!item || item?.importStep === 999) return item;
  else {
    item = item as ImportItem;
  }
  if (!item.file || !item.file.path) {
    throw new Error("Item has no file path");
  }
  const combineBehavior = get(settingsJson).combineBehavior;
  if (combineBehavior === "separate" || item.type === "bookmark") {
    item.importStep = 1;
    return item;
  }
  const $savePath = get(settingsJson).savePath;
  const { name, extension } = extractNameAndExtension(
    item.file.path ?? item.name
  );
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

async function possiblyCreateEmptyItem(item: ItemCreate) {
  if (itemAlreadyExists(item.path)) return { ...item, importStep: 999 };
  return (await createItem(item)) as ImportItem;
}
