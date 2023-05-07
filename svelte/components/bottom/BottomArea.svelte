<script lang="ts">
  import ItemPreview from "../main/ItemPreview.svelte";
  import { filteredData, selectedItems } from "../../stores/stateStore";
  import { handleKeydownDetailsView } from "../../utils";
  import type { SingleItem } from "../../stores/items";

  export let items: SingleItem[];

  // select first item if none is selected, i.e. tag selection was changed
  $: if ($selectedItems.ids.length === 0) {
    $selectedItems.ids = [items[0].id];
  }
</script>

<svelte:window on:keydown={handleKeydownDetailsView} />

<div
  class="overflow-y-scroll"
  style="height: calc(var(--bottomContainer) - 0.5rem)"
>
  {#await $filteredData then filteredData}
    {#each filteredData.items as item}
      <div class="inline-block">
        <ItemPreview {item} items={filteredData.items} />
      </div>
    {/each}
  {/await}
</div>
