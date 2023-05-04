<script lang="ts">
  import ItemPreview from "./ItemPreview.svelte";
  import { currView } from "../../stores/stateStore";
  import {
    deleteItems,
    refreshDisplayedItems,
    type SingleItem,
  } from "../../stores/items";
  import { selectedItems } from "../../stores/stateStore";

  export let items: SingleItem[];

  $: gridCols = createGridColsString($currView.zoomLvl);

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

  const handleKeydown = async (e: KeyboardEvent) => {
    if (
      document.activeElement?.tagName === "INPUT" ||
      document.activeElement?.tagName === "TEXTAREA" ||
      //@ts-ignore
      document.activeElement?.isContentEditable
    )
      return;
    if (e.key === "Escape") {
      deselectItems();
    } else if (e.key === "Backspace" && e.metaKey) {
      await deleteItems($selectedItems.ids);
      refreshDisplayedItems();
    } else if (e.key === "ArrowLeft") {
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
      $selectedItems.ids = items.map((item) => item.id);
    } else if ((e.key === "+" || e.key === "*") && e.metaKey && e.shiftKey) {
      e.preventDefault();
      if ($currView.zoomLvl > 1) {
        $currView.zoomLvl--;
      }
    } else if ((e.key === "-" || e.key === "_") && e.metaKey && e.shiftKey) {
      e.preventDefault();
      $currView.zoomLvl++;
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="h-full" on:click={deselectItems} on:keydown={() => {}}>
  <div class="myGrid" style={`--grid-cols-string: ${gridCols};`}>
    {#each items as item}
      <ItemPreview {item} {items} />
    {/each}
  </div>
</div>

<style>
  .myGrid {
    display: grid;
    grid-template-columns: var(--grid-cols-string);
    grid-template-rows: 1;
    /* padding: 0.375rem; */
  }
</style>
