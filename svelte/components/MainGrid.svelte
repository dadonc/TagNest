<script lang="ts">
  import ItemPreview from "./ItemPreview.svelte";
  import { currView } from "../stores/CurrViewStore";
  import {
    deleteItems,
    refreshDisplayedItems,
    type SingleItem,
  } from "../stores/items";
  import { state } from "../stores/stateStore";

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
    $state.selectedItems = [];
  };

  const handleKeydown = async (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      deselectItems();
    } else if (e.key === "Backspace" && e.metaKey) {
      await deleteItems($state.selectedItems);
      refreshDisplayedItems();
    } else if (e.key === "ArrowLeft") {
      if ($state.selectedItems.length == 1) {
        const item = items.find((item) => item.id === $state.selectedItems[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index > 0) {
            $state.selectedItems = [items[index - 1].id];
          }
        }
      }
    } else if (e.key === "ArrowRight") {
      if ($state.selectedItems.length == 1) {
        const item = items.find((item) => item.id === $state.selectedItems[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index < items.length - 1) {
            $state.selectedItems = [items[index + 1].id];
          }
        }
      }
    } else if (e.key === "ArrowUp") {
      if ($state.selectedItems.length == 1) {
        const item = items.find((item) => item.id === $state.selectedItems[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index - $currView.zoomLvl >= 0) {
            $state.selectedItems = [items[index - $currView.zoomLvl].id];
          }
        }
      }
    } else if (e.key === "ArrowDown") {
      if ($state.selectedItems.length == 1) {
        const item = items.find((item) => item.id === $state.selectedItems[0]);
        if (item) {
          const index = items.indexOf(item);
          if (index + $currView.zoomLvl < items.length) {
            $state.selectedItems = [items[index + $currView.zoomLvl].id];
          }
        }
      }
    }
  };
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="h-full" on:click={deselectItems} on:keydown={() => {}}>
  <div class="myGrid" style={`--grid-cols-string: ${gridCols};`}>
    {#each items as item}
      <ItemPreview {item} />
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
