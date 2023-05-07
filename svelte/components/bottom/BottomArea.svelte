<script lang="ts">
  import ItemPreview from "../main/ItemPreview.svelte";
  import { filteredData } from "../../stores/stateStore";
  import { handleKeydownDetailsView } from "../../utils";
</script>

<svelte:window on:keydown={handleKeydownDetailsView} />

<div class="flex items-center h-full">
  {#await $filteredData then filteredData}
    {#each filteredData.items as item}
      <div class="max-h-full">
        <ItemPreview {item} items={filteredData.items} />
      </div>
    {/each}
  {/await}
</div>
