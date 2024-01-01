<script lang="ts">
  import { contextMenuStore } from "../../stores/stateStore";
  import { possibylCloseContextMenu, getPxfromRem } from "../../utils";

  let contextMenuWidth = getPxfromRem(8); // w-32

  $: shouldOpenLeft =
    $contextMenuStore.x + contextMenuWidth < window.innerWidth;
  $: pos = shouldOpenLeft
    ? `top: ${$contextMenuStore.y}px; left: ${$contextMenuStore.x}px`
    : `top: ${$contextMenuStore.y}px; left: ${
        $contextMenuStore.x - contextMenuWidth
      }px`;
</script>

<svelte:window on:click={possibylCloseContextMenu} />

{#if $contextMenuStore.isContextMenuOpen}
  <div id="contextMenu" class="absolute z-20 w-32 bg-red-500" style={pos}>
    hullo
  </div>
{/if}
