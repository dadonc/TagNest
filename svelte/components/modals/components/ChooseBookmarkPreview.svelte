<script lang="ts">
  import { onMount } from "svelte";
  import {
    updateBookmarkPreviewImage,
    type SingleItem,
  } from "../../../stores/items";
  import { updateItemPreviews } from "../../../utils";

  export let item: SingleItem;
  export let close: () => void;
  let path = "file://" + item.bookmark?.previewImagePath;
  let images: string[] = [];

  $: saveDisabled = path === "file://" + item.bookmark?.previewImagePath;

  onMount(async () => {
    if (item.bookmark) {
      images = [
        ("file://" + item.bookmark.screenshotPath) as string,
        ...(await window.electron.extractBookmarkImages(item.file!.path)),
      ];
    } else {
      console.error("No mhtmlFilename");
    }
  });

  async function changeSelection(imagePath: string) {
    // If the image is already a file path, just use it
    if (imagePath.includes("file://")) {
      path = imagePath;
      // const newPreviewPath = imagePath.replace("file://", "");
      // if (item.bookmark) item.bookmark.previewImagePath = newPreviewPath;
      // await updateBookmarkPreviewImage(item);
      return;
    }

    let [header, imageData] = imagePath.split(";base64,");
    header = header.slice(0, -1);
    const cleanedString = header + ";base64," + imageData;
    path = cleanedString;
  }

  async function saveNewThumb() {
    if (!item.bookmark || !item.bookmark.screenshotPath) return;

    // If the image is already a file path, just use it
    if (path.includes("file://")) {
      path = path;
      const newPreviewPath = path.replace("file://", "");
      if (item.bookmark) item.bookmark.previewImagePath = newPreviewPath;
      await updateBookmarkPreviewImage(item);
      close();
      return;
    }
    // else delete the old image and save the new image as a new file
    if (item.bookmark?.previewImagePath?.includes("_preview_")) {
      await window.electron.deleteFile(item.bookmark.previewImagePath);
    }

    const newPreviewPath = await window.electron.saveImageFromString({
      imageBase64: path,
      path: item.bookmark.screenshotPath,
      isPreview: true,
    });
    path = "file://" + newPreviewPath;
    item.bookmark.previewImagePath = newPreviewPath;
    await updateBookmarkPreviewImage(item);
    updateItemPreviews(item.id, path);
    close();
  }
</script>

<h1 class="mt-2 mb-4 text-3xl text-center">Choose Thumbnail</h1>
<h2 class="mt-2 mb-4 text-xl">Selected</h2>

<div class="flex justify-center item-center">
  <img src={path} alt="Bookmark preview" />
</div>

<h2 class="mt-2 mb-4 text-xl">Available</h2>

{#if images.length > 0}
  <div class="flex flex-wrap">
    {#each images as image}
      <div class="w-1/2 p-1">
        <img
          src={image}
          alt="Bookmark preview"
          on:keydown={(e) => {
            if (e.key === "Enter") {
            }
          }}
          on:click={() => changeSelection(image)}
        />
      </div>
    {/each}
  </div>
{:else}
  <p>No images found</p>
{/if}

<div class="flex justify-center mt-2 gap-x-2">
  <button class="btn btn-tertiary" on:click={close}>Cancel</button>
  <button
    disabled={saveDisabled}
    on:click={saveNewThumb}
    class="btn btn-primary">Save</button
  >
</div>
