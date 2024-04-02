<script lang="ts">
  import { contextMenuStore } from "../../stores/stateStore";
  import { getPxfromRem } from "../../utils";

  let contextMenuWidth = getPxfromRem(12); // w-48

  $: shouldOpenLeft =
    $contextMenuStore.x + contextMenuWidth < window.innerWidth;
  $: pos = shouldOpenLeft
    ? `top: ${$contextMenuStore.y}px; left: ${$contextMenuStore.x}px`
    : `top: ${$contextMenuStore.y}px; left: ${
        $contextMenuStore.x - contextMenuWidth
      }px`;
</script>

{#if $contextMenuStore.isContextMenuOpen}
  <div
    id="contextMenu"
    class="absolute z-50 w-48 text-sm border rounded-sm shadow-lg bg-base-100 border-base-200"
    style={pos}
  >
    <slot />
  </div>
{/if}
