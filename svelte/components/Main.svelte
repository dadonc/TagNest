<script lang="ts">
  import ItemPreview from "./ItemPreview.svelte";
  import { currView } from "../stores/CurrViewStore";
  import { items } from "../stores/items";
  import { state } from "../stores/stateStore";

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
</script>

<div class="h-full" on:click={deselectItems} on:keydown={() => {}}>
  {#await $items}
    <div>Loading...</div>
  {:then items}
    <div class="myGrid" style={`--grid-cols-string: ${gridCols};`}>
      {#each items as item}
        <ItemPreview {item} />
      {/each}
    </div>
  {/await}
</div>

<style>
  .myGrid {
    display: grid;
    grid-template-columns: var(--grid-cols-string);
    grid-template-rows: 1;
    /* padding: 0.375rem; */
  }
</style>
