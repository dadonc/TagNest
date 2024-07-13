<script lang="ts">
  import { closePin } from "../../stores/pins";
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
  </ContextMenu>
{/if}
