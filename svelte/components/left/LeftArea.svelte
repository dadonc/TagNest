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
    outline: none;
    margin-bottom: 1rem;
  }

  .activeDrawer {
    /* text-primary */
    border-bottom: 3px solid hsl(var(--p) / 1);
  }
</style>
