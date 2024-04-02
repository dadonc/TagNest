<script lang="ts">
  import { contextMenuStore, selectedTags } from "../../stores/stateStore";
  import { allTags } from "../../stores/tags";
  import ContextMenu from "../main/ContextMenu.svelte";
  import ContextMenuButton from "../main/ContextMenuButton.svelte";

  let isShowUntagged = false;
</script>

{#if $contextMenuStore.openContextMenu === "tags"}
  <ContextMenu>
    {#if $selectedTags.selectedIds.length > 0 || $selectedTags.deselectedIds.length > 0}
      <ContextMenuButton
        name="Show all items"
        onClick={() => {
          $contextMenuStore.isContextMenuOpen = false;
          $selectedTags.selectedIds = [];
          $selectedTags.deselectedIds = [];
          isShowUntagged = false;
        }}
      />
    {/if}
    {#if !isShowUntagged}
      <ContextMenuButton
        name="Show untagged"
        onClick={() => {
          $contextMenuStore.isContextMenuOpen = false;
          const allTagIds = $allTags.map((tag) => tag.id);
          $selectedTags.deselectedIds = allTagIds;
          isShowUntagged = true;
        }}
      />
    {/if}
    <ContextMenuButton
      name="Rename tag"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        $contextMenuStore.openModal = "renameTag";
      }}
    />
    <ContextMenuButton
      name="Delete tag"
      onClick={() => {
        $contextMenuStore.isContextMenuOpen = false;
        $contextMenuStore.openModal = "deleteTag";
      }}
    />
  </ContextMenu>
{/if}
