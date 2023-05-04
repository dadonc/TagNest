<script lang="ts">
  import { filteredData, currView, state } from "../../stores/stateStore";
  import DetailView from "./DetailView.svelte";
  import MainGrid from "./MainGrid.svelte";
</script>

{#await $filteredData then filteredData}
  {#if $currView.route === "main"}
    <MainGrid items={filteredData.items} />
  {:else if $currView.route === "details"}
    {#each filteredData.items as item}
      {#if item.id === $state.selectedItems[0]}
        <DetailView {item} />
      {/if}
    {/each}
  {/if}
{/await}
