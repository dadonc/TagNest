<script lang="ts">
  import { items, type SingleItem } from "../../stores/items";
  import { contextMenuStore, selectedItems } from "../../stores/stateStore";
  import { possibylCloseContextMenu, getPxfromRem } from "../../utils";

  let contextMenuWidth = getPxfromRem(12); // w-48
  let selectedItem: SingleItem | undefined = undefined;

  $: shouldOpenLeft =
    $contextMenuStore.x + contextMenuWidth < window.innerWidth;
  $: pos = shouldOpenLeft
    ? `top: ${$contextMenuStore.y}px; left: ${$contextMenuStore.x}px`
    : `top: ${$contextMenuStore.y}px; left: ${
        $contextMenuStore.x - contextMenuWidth
      }px`;

  $: {
    if ($selectedItems.ids.length === 1) {
      const item = $items.find((item) => item.id === $selectedItems.ids[0]);
      if (item) {
        selectedItem = item;
      }
    }
  }

  $: isSingleVideo = selectedItem && selectedItem.type === "video";
</script>

<svelte:window on:click={possibylCloseContextMenu} />

{#if $contextMenuStore.isContextMenuOpen}
  <div
    id="contextMenu"
    class="absolute z-20 w-48 text-sm rounded bg-base-100"
    style={pos}
  >
    {#if $selectedItems.ids.length === 1}
      <button
        class="py-1 mx-2 text-left border-b w-44 text-base-content hover:bg-base-300 border-base-content"
        on:click={() => {
          $contextMenuStore.isContextMenuOpen = false;
          $contextMenuStore.openModal = "editItem";
        }}
      >
        Edit Item
      </button>
      {#if isSingleVideo}
        <button
          class="py-1 mx-2 text-left border-b w-44 text-base-content hover:bg-base-300 border-base-content"
          on:click={() => {
            $contextMenuStore.isContextMenuOpen = false;
            $contextMenuStore.openModal = "videoThumbnail";
          }}
        >
          Recreate Thumbnail
        </button>
        <button
          class="py-1 mx-2 text-left border-b w-44 text-base-content hover:bg-base-300 border-base-content"
          on:click={() => {
            $contextMenuStore.isContextMenuOpen = false;
            $contextMenuStore.openModal = "videoPreview";
          }}
        >
          Recreate Preview
        </button>
      {/if}
      <button
        class="py-1 mx-2 text-left w-44 text-base-content hover:bg-base-300 border-base-content"
        on:click={() => {
          $contextMenuStore.isContextMenuOpen = false;
        }}
      >
        Open in file browser
      </button>
    {:else if $selectedItems.ids.length > 1}
      <button
        class="py-1 mx-2 text-left border-b w-44 text-base-content hover:bg-base-300 border-base-content"
        on:click={() => {
          $contextMenuStore.isContextMenuOpen = false;
          $contextMenuStore.openModal = "editItems";
        }}
      >
        Edit {$selectedItems.ids.length} Items
      </button>
    {/if}
  </div>
{/if}
