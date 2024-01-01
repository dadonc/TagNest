<script lang="ts">
  import { clickedOutsideContextMenu, getPxfromRem } from "../../utils";

  export let contextMenuX = 0;
  export let contextMenuY = 0;
  export let isContextMenuOpen = false;

  let contextMenuWidth = getPxfromRem(8); // w-32

  $: shouldOpenLeft = contextMenuX + contextMenuWidth < window.innerWidth;
  $: pos = shouldOpenLeft
    ? `top: ${contextMenuY}px; left: ${contextMenuX}px`
    : `top: ${contextMenuY}px; left: ${contextMenuX - contextMenuWidth}px`;
</script>

<svelte:window
  on:click={(e) => {
    if (clickedOutsideContextMenu(e)) {
      isContextMenuOpen = false;
    }
  }}
/>

{#if isContextMenuOpen}
  <div id="contextMenu" class="absolute z-20 w-32 bg-red-500" style={pos}>
    hullo
  </div>
{/if}
