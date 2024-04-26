<script lang="ts">
  import { get } from "svelte/store";
  import {
    currView,
    currentRoute,
    filteredData,
  } from "../../stores/stateStore";

  export let itemsCount: number;
  $: $filteredData.then((data) => (itemsCount = data.items.length));
</script>

<div class="inline-block" style="width: var(--leftContainer)" />
<div
  class="inline-flex items-center w-full h-full"
  style="width: calc(100% - var(--leftContainer) - var(--rightContainer) - var(--dividerWidth) - var(--dividerWidth))"
>
  <button
    type="button"
    on:click={() => {
      currView.update((v) => {
        if (get(currentRoute) === "main") {
          if (v.zoomLvl === 1) return v;
          v.zoomLvl = v.zoomLvl - 1;
          return v;
        } else {
          if (v.zoomLvlDetails === 1) return v;
          v.zoomLvlDetails = v.zoomLvlDetails - 1;
          return v;
        }
      });
    }}
    class="ml-2 mr-3 text-2xl">+</button
  >

  <button
    type="button"
    on:click={(e) => {
      currView.update((v) => {
        if (get(currentRoute) === "main") {
          if (v.zoomLvl === 1) return v;
          v.zoomLvl = v.zoomLvl + 1;
          return v;
        } else {
          if (v.zoomLvlDetails === 1) return v;
          v.zoomLvlDetails = v.zoomLvlDetails + 1;
          return v;
        }
      });
    }}
    class="text-3xl">-</button
  >
  <div class="w-full text-sm text-center">
    {itemsCount} items
  </div>
</div>
<div class="inline-block" style="width: var(--rightContainer)" />

<style>
  button {
    outline: none;
  }
</style>
