<script lang="ts">
  import type { FilteredTag } from "../../stores/stateStore";
  import LeftAreaHighlights from "./LeftAreaHighlights.svelte";
  import LeftAreaTags from "./LeftAreaTags.svelte";

  export let tags: FilteredTag[];

  let activeDrawer: "highlights" | "tags" = "highlights";
</script>

<button
  class={activeDrawer === "highlights" ? "activeDrawer" : "inactiveDrawer"}
  on:click={() => (activeDrawer = "highlights")}>Highlights</button
>
<button
  class={activeDrawer === "tags" ? "activeDrawer" : "inactiveDrawer"}
  on:click={() => (activeDrawer = "tags")}>Tags</button
>

{#if activeDrawer === "highlights"}
  <LeftAreaHighlights />
{:else if activeDrawer === "tags"}
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
