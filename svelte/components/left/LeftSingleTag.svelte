<script lang="ts">
  import {
    selectedTags,
    type FilteredTag,
    contextMenuStore,
  } from "../../stores/stateStore";
  import { classNames, openContextMenu } from "../../utils";

  export let tag: FilteredTag;
  export let indent: number;
  $: isSelected = $selectedTags.selectedIds.includes(tag.id);
  $: isDeSelected = $selectedTags.deselectedIds.includes(tag.id);

  function toggleSelectTag(id: string) {
    if ($contextMenuStore.isContextMenuOpen) {
      $contextMenuStore.isContextMenuOpen = false;
    }
    if (isDeSelected) {
      toggleDeselectTag(id);
      return;
    }
    if ($selectedTags.selectedIds.includes(id)) {
      $selectedTags.selectedIds = [
        ...$selectedTags.selectedIds.filter((t) => t !== id),
      ];
    } else {
      $selectedTags.selectedIds = [...$selectedTags.selectedIds, id];
    }
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  function toggleDeselectTag(id: string) {
    if ($contextMenuStore.isContextMenuOpen) {
      $contextMenuStore.isContextMenuOpen = false;
    }
    if ($selectedTags.deselectedIds.includes(id)) {
      $selectedTags.deselectedIds = [
        ...$selectedTags.deselectedIds.filter((t) => t !== id),
      ];
    } else {
      $selectedTags.deselectedIds = [...$selectedTags.deselectedIds, id];
    }
  }

  function openTagsContextMenu(e: MouseEvent) {
    $contextMenuStore.triggeredByTagId = tag.id;
    openContextMenu(e, "tags");
  }
</script>

<div
  on:contextmenu={openTagsContextMenu}
  class="flex items-center h-5 text-sm font-medium whitespace-nowrap"
  style={`margin-left: ${indent * 0.5}rem`}
>
  <span>
    {#if !isSelected && tag.countAfterDeselection !== 0}
      <button
        on:click={() => toggleDeselectTag(tag.id)}
        class="flex items-center justify-center w-2 px-3 font-mono text-xs text-white bg-error rounded-3xl"
        >{tag.countAfterDeselection}</button
      >
    {:else}
      <div
        class="flex items-center justify-center w-2 px-3 font-mono text-xs text-white opacity-0 bg-error rounded-3xl"
      >
        00
      </div>
    {/if}
  </span>
  <button
    class={classNames(
      isSelected ? "bg-accent text-accent-content rounded-md" : "",
      isDeSelected ? "bg-error text-error-content rounded-md" : "",
      " w-full flex justify-between items-center pl-1"
    )}
    on:click={() => toggleSelectTag(tag.id)}
  >
    <span>
      {tag.name.split(":").slice(-1)}
    </span>
    {#if !isSelected && !isDeSelected && tag.countAfterSelection !== 0}
      <span
        class="flex items-center justify-center px-3 text-xs text-white bg-accent rounded-3xl"
        >{tag.totalCount}</span
      >
    {/if}
  </button>
</div>

<style>
  button:focus {
    outline: none;
    /* accent color */
    /* border-bottom: 1px solid hsl(var(--a) / var(--tw-bg-opacity)); */
  }
</style>
