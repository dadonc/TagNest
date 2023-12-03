<script lang="ts">
  import Preview from "./Preview.svelte";
  import { currView, filteredData } from "../../stores/stateStore";
  import { type SingleItem } from "../../stores/items";
  import { selectedItems } from "../../stores/stateStore";
  import PreviewModal from "./PreviewModal.svelte";
  import { addToDeleteQueue } from "./delete/DeleteQueue";
  import { onMount, tick } from "svelte";
  import { topContainer } from "../../stores/cssStore";
  import { getPxfromRem } from "../../utils";

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

  const deselectItems = () => {
    $selectedItems.ids = [];
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
      if (!isPreviewModalOpen) {
        deselectItems();
      }
    } else if (e.key === "Backspace" && e.metaKey) {
      addToDeleteQueue($selectedItems.ids);
      $selectedItems.ids = [];
    } else if (e.key === "ArrowLeft") {
      if (handleKeydownExceptions(e)) return;
      if ($selectedItems.ids.length == 1) {
        const item = items.find((item) => item.id === $selectedItems.ids[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index > 0) {
            $selectedItems.ids = [items[index - 1].id];
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
          }
        }
      }
    } else if (e.key === "ArrowUp") {
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
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<PreviewModal item={previewItem} bind:isOpen={isPreviewModalOpen} />

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
