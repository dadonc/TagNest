<script lang="ts">
  import { importItems } from "../stores/items";
  import { currView } from "../stores/stateStore";
  import { filteredData } from "../stores/stateStore";
</script>

<div class="inline-block" style="width: var(--leftContainer)" />
<div
  class="inline-flex items-center w-full h-full text-2xl"
  style="width: calc(100% - var(--leftContainer) - var(--rightContainer))"
>
  <button
    on:click={() => {
      currView.update((v) => {
        if (v.zoomLvl === 1) return v;
        v.zoomLvl = v.zoomLvl - 1;
        return v;
      });
    }}
    class="ml-2 mr-4">+</button
  >

  <button
    on:click={() => {
      currView.update((v) => {
        v.zoomLvl = v.zoomLvl + 1;
        return v;
      });
    }}>-</button
  >
  <div class="w-full text-sm text-center">
    {#await $filteredData then data}
      {#if $currView.route === "importMultiple"}
        {$importItems.length} items to import
      {:else}
        {data.items.length} items
      {/if}
    {/await}
  </div>
</div>
<div class="inline-block" style="width: var(--rightContainer)" />
