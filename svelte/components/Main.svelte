<script lang="ts">
  import { getItems } from "../stores/items";
  import ItemPreview from "./ItemPreview.svelte";
  import { currView } from "../stores/CurrViewStore";

  const items = getItems();
  $: gridCols = createGridColsString($currView.zoomLvl);

  const createGridColsString = (zoomLvl: number) => {
    let str = "";
    for (let i = 0; i < zoomLvl; i++) {
      str += "1fr ";
    }
    return str;
  };
</script>

{#await items}
  <div>Loading...</div>
{:then items}
  {#each items as item}
    <div class="myGrid" style={`--grid-cols-string: ${gridCols};`}>
      <ItemPreview {item} />
    </div>
  {/each}
{/await}

<style>
  .myGrid {
    display: grid;
    grid-template-columns: var(--grid-cols-string);
    /* grid-template-rows: 1; */
    /* padding: 0.375rem; */
  }
</style>
