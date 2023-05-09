<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
  export let path: string;
  let images: string[] = [];
  $: isExpanded = path ? false : true;

  const dispatch = createEventDispatcher();

  onMount(async () => {
    if (item.bookmark?.mhtmlFilename) {
      images = [
        item.bookmark.screenshot as string,
        ...(await window.electron.extractBookmarkImages(
          item.bookmark?.mhtmlFilename
        )),
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
              isExpanded = false;
            }
          }}
          on:click={() => {
            dispatch("image-chosen", { image });
            isExpanded = false;
          }}
        />
      </div>
    {/each}
  </div>
{:else}
  <p>No images found</p>
{/if}
