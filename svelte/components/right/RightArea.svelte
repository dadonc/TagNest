<script lang="ts">
  import { currentRoute, selectedItems } from "../../stores/stateStore";
  import { importItems, type SingleItem } from "../../stores/items";
  import RightEditSingle from "./RightEditSingle.svelte";
  import RightEditMultiple from "./RightEditMultiple.svelte";

  export let items: SingleItem[];

  $: itemsToUse = $currentRoute === "importMultiple" ? $importItems : items;
</script>

<div class="h-full select-none">
  {#if $selectedItems.ids.length === 1}
    {#each itemsToUse as item}
      {#if item.id === $selectedItems.ids[0]}
        <RightEditSingle {item} />
      {/if}
    {/each}
  {:else if $selectedItems.ids.length > 1}
    <RightEditMultiple {items} />
  {:else}
    <div class="flex flex-col items-center justify-center h-full text-center">
      <div class="text-2xl font-bold">No item selected</div>
      <div class="text-sm text-gray-500">Select an item to edit it.</div>
    </div>
  {/if}
</div>
