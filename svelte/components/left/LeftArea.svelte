<script lang="ts">
  import { items } from "../../stores/items";
  import {
    currentRoute,
    selectedItems,
    type FilteredTag,
  } from "../../stores/stateStore";
  import LeftAreaHighlights from "./LeftAreaHighlights.svelte";
  import LeftAreaTags from "./LeftAreaTags.svelte";

  export let tags: FilteredTag[];
  $: selectedItem = $items.filter(
    (item) => item.id === $selectedItems.ids[0]
  )[0];

  let activeDrawer: "highlights" | "tags" = "highlights";

  $: showDrawer =
    selectedItem &&
    $currentRoute === "details" &&
    $selectedItems.ids.length === 1 &&
    selectedItem.type === "bookmark";
</script>

{#if showDrawer}
  <button
    class={activeDrawer === "tags" ? "activeDrawer" : "inactiveDrawer"}
    on:click={() => (activeDrawer = "tags")}>Tags</button
  >
  <button
    class={activeDrawer === "highlights" ? "activeDrawer" : "inactiveDrawer"}
    on:click={() => (activeDrawer = "highlights")}>Highlights</button
  >

  {#if activeDrawer === "highlights"}
    <LeftAreaHighlights {selectedItem} />
  {:else if activeDrawer === "tags"}
    <LeftAreaTags {tags} />
  {/if}
{:else}
  <LeftAreaTags {tags} />
{/if}

<style>
  .inactiveDrawer,
  .activeDrawer {
    border: none;
    padding: 0.25rem;
    outline: none;
  }
  .activeDrawer {
    background-color: #f0f0f0;
    border: 1px solid black;
    border-bottom: none;
    border-radius: 8px 8px 0 0;
  }
</style>
