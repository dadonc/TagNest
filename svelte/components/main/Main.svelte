<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import {
    selectedItems,
    currentRoute,
    currView,
  } from "../../stores/stateStore";
  import DetailView from "./DetailView.svelte";
  import MainGrid from "./MainGrid.svelte";
  import MainList from "./MainList.svelte";
  import ImportMultiple from "./import/ImportMultiple.svelte";

  export let items: SingleItem[];
</script>

{#if $currentRoute === "main"}
  {#if $currView.viewType === "grid"}
    <MainGrid {items} focusedItemId={$selectedItems.ids[0]} />
  {:else if $currView.viewType === "list"}
    <MainList {items} focusedItemId={$selectedItems.ids[0]} />
  {/if}
{:else if $currentRoute === "details"}
  {#each items as item}
    {#if item.id === $selectedItems.ids[0]}
      <DetailView {item} />
    {/if}
  {/each}
{:else if $currentRoute === "importMultiple"}
  <ImportMultiple />
{/if}
