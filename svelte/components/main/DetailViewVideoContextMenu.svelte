<script lang="ts">
  import { refreshDisplayedItems, type SingleItem } from "../../stores/items";
  import { contextMenuStore } from "../../stores/stateStore";
  import ContextMenu from "./ContextMenu.svelte";
  import ContextMenuButton from "./ContextMenuButton.svelte";
  import { addVideoMark, deleteMark } from "./DetailViewVideoHelper";

  export let item: SingleItem;

  async function addSimpleMark() {
    await addVideoMark(item.video!.id, $contextMenuStore.videoSeekPos);
    refreshDisplayedItems("added video mark");
  }
</script>

{#if $contextMenuStore.openContextMenu === "videoSeekbar"}
  <ContextMenu>
    <ContextMenuButton
      name="Add mark"
      onClick={() => {
        addSimpleMark();
        $contextMenuStore.isContextMenuOpen = false;
      }}
    />
  </ContextMenu>
{/if}

{#if $contextMenuStore.openContextMenu === "videoMark"}
  <ContextMenu>
    <ContextMenuButton
      name="Delete mark"
      onClick={async () => {
        await deleteMark($contextMenuStore.triggeredByMarkId);
        refreshDisplayedItems("deleted video mark");
        $contextMenuStore.isContextMenuOpen = false;
      }}
    />
  </ContextMenu>
{/if}
