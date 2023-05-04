<script lang="ts">
  import { selectedTags, type FilteredTag } from "../../stores/stateStore";
  import { classNames } from "../../utils";

  export let tag: FilteredTag;
  let isSelected = $selectedTags.selectedIds.includes(tag.id);
  let isDeSelected = $selectedTags.deselectedIds.includes(tag.id);

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

<div class="flex h-5">
  {#if tag.countAfterDeselection !== 0}
    <button
      on:click={() => toggleDeselectTag(tag.id)}
      class="flex items-center w-2 mr-1 font-mono text-error"
      >{tag.countAfterDeselection}</button
    >
  {:else}
    <div class="w-2 mr-1 font-mono opacity-0">x</div>
  {/if}
  <button
    class={classNames(
      isSelected ? "bg-accent text-accent-content rounded-md" : "",
      isDeSelected ? "bg-error text-error-content rounded-md" : "",

      "text-sm w-full text-left flex justify-between font-medium h-5 mb-1 pl-1"
    )}
    on:click={() => toggleSelectTag(tag.id)}
  >
    <span>
      {tag.name}
    </span>
    {#if !isSelected && !isDeSelected && tag.countAfterSelection !== 0}
      <span
        class="flex items-center justify-center px-3 bg-accent rounded-3xl text-accent-content"
        >{tag.totalCount}</span
      >
    {/if}
  </button>
</div>
