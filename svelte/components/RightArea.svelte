<script lang="ts">
  import { state } from "../stores/stateStore";
  import { items } from "../stores/items";
  import RightEditSingle from "./RightEditSingle.svelte";
  import RightEditMultiple from "./RightEditMultiple.svelte";
</script>

{#await $items}
  <div />
{:then items}
  {#if $state.selectedItems.length === 1}
    {#each items as item}
      {#if item.id === $state.selectedItems[0]}
        <RightEditSingle {item} />
      {/if}
    {/each}
  {:else if $state.selectedItems.length > 1}
    <RightEditMultiple {items} />
  {:else}
    <div class="flex flex-col items-center justify-center h-full">
      <div class="text-2xl font-bold">No item selected</div>
      <div class="text-sm text-gray-500">Select an item to edit it.</div>
    </div>
  {/if}
{/await}
