<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
  let path = "file://" + item.bookmark?.previewImagePath;
  let images: string[] = [];
  $: isExpanded = path ? false : true;

  const dispatch = createEventDispatcher();

  onMount(async () => {
    if (item.bookmark) {
      images = [
        ("file://" + item.bookmark.previewImagePath) as string,
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
          on:click={() => {
            dispatch("image-chosen", { image });
            if (!item.bookmark || !item.bookmark.screenshotPath) return;

            let [header, imageData] = image.split(";base64,");
            header = header.slice(0, -1);
            const cleanedString = header + ";base64," + imageData;
            window.electron.saveImageFromString({
              imageBase64: cleanedString,
              path: item.bookmark.screenshotPath,
              isPreview: true,
            });
            isExpanded = false;
          }}
        />
      </div>
    {/each}
  </div>
{:else}
  <p>No images found</p>
{/if}
