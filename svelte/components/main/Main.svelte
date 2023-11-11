<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { selectedItems, currentRoute } from "../../stores/stateStore";
  import DetailView from "./DetailView.svelte";
  import MainGrid from "./MainGrid.svelte";
  import ImportMultiple from "./import/ImportMultiple.svelte";

  export let items: SingleItem[];
</script>

{#if $currentRoute === "main"}
  <MainGrid {items} focusedItemId={$selectedItems.ids[0]} />
{:else if $currentRoute === "details"}
  {#each items as item}
    {#if item.id === $selectedItems.ids[0]}
      <DetailView {item} />
    {/if}
  {/each}
{:else if $currentRoute === "importMultiple"}
  <ImportMultiple />
{/if}
