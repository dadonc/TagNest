<script lang="ts">
  import { closePin, pins } from "../../stores/pins";
  import { contextMenuStore } from "../../stores/stateStore";
  import ContextMenu from "./ContextMenu.svelte";
  import ContextMenuButton from "./ContextMenuButton.svelte";
</script>

{#if $contextMenuStore.openContextMenu === "pin"}
  <ContextMenu>
    <ContextMenuButton
      name="Close pin"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        closePin($contextMenuStore.triggeredByPinItemId);
      }}
    />
    <ContextMenuButton
      name="Close all pins"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        $pins = [$pins[0]];
      }}
    />
  </ContextMenu>
{/if}
