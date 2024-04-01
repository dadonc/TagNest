<script lang="ts">
  import Preview from "./Preview.svelte";
  import {
    contextMenuStore,
    currView,
    currentRoute,
  } from "../../stores/stateStore";
  import { type SingleItem } from "../../stores/items";
  import { selectedItems } from "../../stores/stateStore";
  import PreviewModal from "./PreviewModal.svelte";
  import { confirmDelete } from "./delete/DeleteQueue";
  import { onMount } from "svelte";
  import { topContainer } from "../../stores/cssStore";
  import {
    deselectItems,
    getPxfromRem,
    isElementInViewport,
  } from "../../utils";
  import ActionModal from "../modals/ActionModal.svelte";

  export let items: SingleItem[];
  export let focusedItemId: string | undefined = undefined;

  onMount(async () => {
    if (focusedItemId) {
      setTimeout(() => {
        const focusedItem = document.getElementById(focusedItemId!);
        document.getElementById("mainArea")!.scrollTop =
          focusedItem!.offsetTop -
          getPxfromRem(Number($topContainer.val.slice(0, -3)));
      }, 0);
    }
  });

  let isPreviewModalOpen = false;
  let previewItem: SingleItem;

  $: gridCols = createGridColsString($currView.zoomLvl);

  $: {
    if ($selectedItems.ids.length === 1) {
      if (isPreviewModalOpen) {
        const item = items.find((item) => item.id === $selectedItems.ids[0]);
        if (item) {
          previewItem = item;
        }
      }
    }
  }

  const createGridColsString = (zoomLvl: number) => {
    let str = "";
    for (let i = 0; i < zoomLvl; i++) {
      str += "1fr ";
    }
    return str;
  };

  const handleKeydownExceptions = (e: KeyboardEvent) => {
    const video = document.getElementById("videoPlayer") as HTMLVideoElement;
    const isVideoPlaying = video && !video.paused;
    if (isVideoPlaying) {
      return true;
    }
  };

  const handleKeydown = async (e: KeyboardEvent) => {
    if (
      document.activeElement?.tagName === "INPUT" ||
      document.activeElement?.tagName === "TEXTAREA" ||
      //@ts-ignore
      document.activeElement?.isContentEditable
    )
      return;
    if (e.key === "Escape") {
      // Close Modal - used if a edit bookmark modal is open, ChooseBookmarkPreview is open and then it is closed using escape -> the modal doesn't have focus anymore
      $contextMenuStore.openModal = "";
      $contextMenuStore.isContextMenuOpen = false;
      deselectItems();
      // if (!isPreviewModalOpen) {
      //   $contextMenuStore.isContextMenuOpen = false;
      //   deselectItems();
      // }
    } else if (e.key === "Backspace" && e.metaKey) {
      confirmDelete($selectedItems.ids);
      $selectedItems.ids = [];
    } else if (e.key === "ArrowLeft") {
      if (handleKeydownExceptions(e)) return;
      if ($selectedItems.ids.length == 1) {
        const item = items.find((item) => item.id === $selectedItems.ids[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index > 0) {
            $selectedItems.ids = [items[index - 1].id];
          } else {
            $selectedItems.ids = [items[items.length - 1].id];
          }
        }
      }
    } else if (e.key === "ArrowRight") {
      if (handleKeydownExceptions(e)) return;
      if ($selectedItems.ids.length == 1) {
        const item = items.find((item) => item.id === $selectedItems.ids[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index < items.length - 1) {
            $selectedItems.ids = [items[index + 1].id];
          } else {
            $selectedItems.ids = [items[0].id];
          }
        }
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if ($selectedItems.ids.length == 1) {
        const item = items.find((item) => item.id === $selectedItems.ids[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index - $currView.zoomLvl >= 0) {
            $selectedItems.ids = [items[index - $currView.zoomLvl].id];
          }
        }
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if ($selectedItems.ids.length == 1) {
        const item = items.find((item) => item.id === $selectedItems.ids[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index + $currView.zoomLvl < items.length) {
            $selectedItems.ids = [items[index + $currView.zoomLvl].id];
          }
        }
      }
    } else if (e.key === "a" && e.metaKey) {
      e.preventDefault();
      $selectedItems.ids = items.map((item) => item.id);
    } else if ((e.key === "+" || e.key === "*") && e.metaKey && e.shiftKey) {
      e.preventDefault();
      if ($currView.zoomLvl > 1) {
        $currView.zoomLvl--;
      }
    } else if ((e.key === "-" || e.key === "_") && e.metaKey && e.shiftKey) {
      e.preventDefault();
      $currView.zoomLvl++;
    } else if (e.key === " ") {
      if ($selectedItems.ids.length === 1) {
        isPreviewModalOpen = true;
      }
    } else if (e.key === "Enter") {
      if ($selectedItems.ids.length === 1) {
        $currentRoute = "details";
      }
    }

    const currSelected = document.getElementById($selectedItems.ids[0]);
    if (currSelected && !isElementInViewport(currSelected)) {
      currSelected.scrollIntoView();
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<PreviewModal item={previewItem} bind:isOpen={isPreviewModalOpen} />
<ActionModal />

<div class="h-full" on:click={deselectItems} on:keydown={() => {}}>
  <div class="p-1 myGrid" style={`--grid-cols-string: ${gridCols};`}>
    {#each items as item (item.id)}
      <Preview {item} {items} />
    {/each}
  </div>
</div>

<style>
  .myGrid {
    display: grid;
    grid-template-columns: var(--grid-cols-string);
    grid-template-rows: 1;
    /* padding: 0.375rem; */
    grid-gap: 0.25rem;
  }
</style>
