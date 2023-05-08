<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import {
    filteredData,
    currView,
    selectedItems,
  } from "../../stores/stateStore";
  import DetailView from "./DetailView.svelte";
  import MainGrid from "./MainGrid.svelte";
  import ImportMultiple from "./import/ImportMultiple.svelte";

  export let items: SingleItem[];
</script>

{#if $currView.route === "main"}
  <MainGrid {items} />
{:else if $currView.route === "details"}
  {#each items as item}
    {#if item.id === $selectedItems.ids[0]}
      <DetailView {item} />
    {/if}
  {/each}
{:else if $currView.route === "importMultiple"}
  <ImportMultiple />
{/if}
