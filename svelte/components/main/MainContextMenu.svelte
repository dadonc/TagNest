<script lang="ts">
  import { items, type SingleItem } from "../../stores/items";
  import { contextMenuStore, selectedItems } from "../../stores/stateStore";
  import ContextMenu from "./ContextMenu.svelte";
  import ContextMenuButton from "./ContextMenuButton.svelte";

  let selectedItem: SingleItem | undefined = undefined;

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

<ContextMenu>
  {#if $selectedItems.ids.length === 1}
    <ContextMenuButton
      name="Edit Item"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        $contextMenuStore.openModal = "editItem";
      }}
    />
    {#if isSingleVideo}
      <ContextMenuButton
        name="Change Thumbnail"
        onClick={() => {
          $contextMenuStore.isContextMenuOpen = false;
          $contextMenuStore.openModal = "videoThumbnail";
        }}
      />

      <ContextMenuButton
        name="Recreate Preview"
        onClick={() => {
          $contextMenuStore.isContextMenuOpen = false;
          $contextMenuStore.openModal = "videoPreview";
        }}
      />
    {/if}
    <ContextMenuButton
      name="Open in file browser"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        window.electron.openFileInFileBrowser(selectedItem?.file?.path || "");
      }}
    />
  {:else if $selectedItems.ids.length > 1}
    <ContextMenuButton
      name="Edit {$selectedItems.ids.length} Items"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        $contextMenuStore.openModal = "editItems";
      }}
    />

    <ContextMenuButton
      name="Reset count of {$selectedItems.ids.length} Items"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        $contextMenuStore.openModal = "resetCounts";
      }}
    />
  {/if}
</ContextMenu>
