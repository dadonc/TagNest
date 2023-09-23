<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import {
    updateBookmarkPreviewImage,
    type SingleItem,
  } from "../../stores/items";

  export let item: SingleItem;
  let path = "file://" + item.bookmark?.previewImagePath;
  let images: string[] = [];
  let isExpanded = false;

  const dispatch = createEventDispatcher();

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
</script>

{#if !isExpanded}
  <div class="flex justify-center item-center">
    <img
      src={path}
      alt="Bookmark preview"
      on:keydown={(e) => {
        if (e.key === "Enter") {
          isExpanded = true;
        }
      }}
      on:click={() => (isExpanded = true)}
    />
  </div>
{:else if images.length > 0}
  <div class="flex flex-wrap">
    {#each images as image}
      <div class="w-1/2 p-1">
        <img
          src={image}
          alt="Bookmark preview"
          on:keydown={(e) => {
            if (e.key === "Enter") {
              dispatch("image-chosen", { image });
              if (!item.bookmark || !item.bookmark.screenshotPath) return;
              isExpanded = false;
            }
          }}
          on:click={async () => {
            if (!item.bookmark || !item.bookmark.screenshotPath) return;

            if (item.bookmark?.previewImagePath?.includes("_preview")) {
              await window.electron.deleteFile(item.bookmark.previewImagePath);
            }
            // If the image is already a file path, just use it
            if (image.includes("file://")) {
              path = image;
              isExpanded = false;
              const newPreviewPath = image.replace("file://", "");
              item.bookmark.previewImagePath = newPreviewPath;
              await updateBookmarkPreviewImage(item);
              dispatch("image-chosen", {
                newPreviewPath,
              });
              return;
            }
            // Otherwise, save the image to a file and use that
            let [header, imageData] = image.split(";base64,");
            header = header.slice(0, -1);
            const cleanedString = header + ";base64," + imageData;
            const newPreviewPath = await window.electron.saveImageFromString({
              imageBase64: cleanedString,
              path: item.bookmark.screenshotPath,
              isPreview: true,
            });
            isExpanded = false;
            path = "file://" + newPreviewPath;
            item.bookmark.previewImagePath = newPreviewPath;
            await updateBookmarkPreviewImage(item);

            dispatch("image-chosen", { newPreviewPath });
          }}
        />
      </div>
    {/each}
  </div>
{:else}
  <p>No images found</p>
{/if}
