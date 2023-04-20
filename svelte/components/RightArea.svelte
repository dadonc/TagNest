<script lang="ts">
  import { state } from "../stores/stateStore";
  import { items, type SingleItem } from "../stores/items";
  import RightEditSingle from "./RightEditSingle.svelte";
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
  {/if}
{/await}
