<script lang="ts">
  import {
    filteredData,
    currView,
    selectedItems,
  } from "../../stores/stateStore";
  import DetailView from "./DetailView.svelte";
  import MainGrid from "./MainGrid.svelte";
</script>

{#await $filteredData then filteredData}
  {#if $currView.route === "main"}
    <MainGrid items={filteredData.items} />
  {:else if $currView.route === "details"}
    {#each filteredData.items as item}
      {#if item.id === $selectedItems.ids[0]}
        <DetailView {item} />
      {/if}
    {/each}
  {/if}
{/await}
