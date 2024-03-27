<script lang="ts">
  import { selectedTags, type FilteredTag } from "../../stores/stateStore";
  import { classNames } from "../../utils";

  export let tag: FilteredTag;
  $: isSelected = $selectedTags.selectedIds.includes(tag.id);
  $: isDeSelected = $selectedTags.deselectedIds.includes(tag.id);

  function toggleSelectTag(id: string) {
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
    if ($selectedTags.deselectedIds.includes(id)) {
      $selectedTags.deselectedIds = [
        ...$selectedTags.deselectedIds.filter((t) => t !== id),
      ];
    } else {
      $selectedTags.deselectedIds = [...$selectedTags.deselectedIds, id];
    }
  }
</script>

<div class="flex items-center h-5 text-sm font-medium">
  <span>
    {#if tag.countAfterDeselection !== 0}
      <button
        on:click={() => toggleDeselectTag(tag.id)}
        class="w-2 mr-1 font-mono text-xs text-error"
        >{tag.countAfterDeselection}</button
      >
    {:else}
      <div class="w-2 mr-1 font-mono text-xs opacity-0">00</div>
    {/if}
  </span>
  <button
    class={classNames(
      isSelected ? "bg-accent text-accent-content" : "",
      isDeSelected ? "bg-error text-error-content" : "",

      "rounded-md w-full flex justify-between items-center pl-1"
    )}
    on:click={() => toggleSelectTag(tag.id)}
  >
    <span>
      {tag.name.split(":").slice(-1)}
    </span>
    {#if !isSelected && !isDeSelected && tag.countAfterSelection !== 0}
      <span class="px-3 text-xs bg-accent rounded-3xl text-accent-content"
        >{tag.totalCount}</span
      >
    {/if}
  </button>
</div>
