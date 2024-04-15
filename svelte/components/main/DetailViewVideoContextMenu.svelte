<script lang="ts">
  import { type SingleItem } from "../../stores/items";
  import { contextMenuStore, selectedItems } from "../../stores/stateStore";
  import ContextMenu from "./ContextMenu.svelte";
  import ContextMenuButton from "./ContextMenuButton.svelte";
  import { addVideoMark } from "./DetailViewVideoHelper";

  export let item: SingleItem;

  function addSimpleMark() {
    addVideoMark(item.video!.id, $contextMenuStore.videoSeekPos);
  }
</script>

{#if $contextMenuStore.openContextMenu === "video"}
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
