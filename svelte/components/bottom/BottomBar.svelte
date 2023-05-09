<script lang="ts">
  import { importItems } from "../../stores/items";
  import { currView, currentRoute } from "../../stores/stateStore";

  export let itemsCount: number;
</script>

{#if $currentRoute !== "details"}
  <div class="inline-block" style="width: var(--leftContainer)" />
  <div
    class="inline-flex items-center w-full h-full text-2xl"
    style="width: calc(100% - var(--leftContainer) - var(--rightContainer) - var(--dividerWidth) - var(--dividerWidth))"
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
      {#if $currentRoute === "importMultiple"}
        {$importItems.length} items to import
      {:else}
        {itemsCount} items
      {/if}
    </div>
  </div>
  <div class="inline-block" style="width: var(--rightContainer)" />
{/if}
