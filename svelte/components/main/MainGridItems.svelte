<script lang="ts">
  import Preview from "./Preview.svelte";
  import { currView, currentRoute } from "../../stores/stateStore";
  import { type SingleItem } from "../../stores/items";
  import { deselectItems } from "../../utils";

  export let items: SingleItem[];
  export let isBottomGrid: boolean = false;

  $: zoomLvl =
    $currentRoute === "details" ? $currView.zoomLvlDetails : $currView.zoomLvl;

  $: gridCols = createGridColsString(zoomLvl);

  const createGridColsString = (zoomLvl: number) => {
    let str = "";
    for (let i = 0; i < zoomLvl; i++) {
      str += "1fr ";
    }
    return str;
  };
</script>

<div class="h-full" on:click={deselectItems} on:keydown={() => {}}>
  <div class="p-1 myGrid" style={`--grid-cols-string: ${gridCols};`}>
    {#each items as item (item.id)}
      <Preview {item} {items} {isBottomGrid} />
    {/each}
  </div>
</div>

<style>
  .myGrid {
    display: grid;
    grid-template-columns: var(--grid-cols-string);
    grid-gap: 0.25rem;
  }
</style>
