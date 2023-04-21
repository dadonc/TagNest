<script lang="ts">
  import { selectedTags, type FilteredTag } from "../stores/stateStore";
  import { classNames } from "../utils";

  export let tag: FilteredTag;

  function toggleSelectTag(id: string) {
    if ($selectedTags.selectedIds.includes(id)) {
      $selectedTags.selectedIds = [
        ...$selectedTags.selectedIds.filter((t) => t !== id),
      ];
    } else {
      $selectedTags.selectedIds = [...$selectedTags.selectedIds, id];
    }
  }

  let isSelected = $selectedTags.selectedIds.includes(tag.id);
</script>

<button
  class={classNames(
    isSelected ? "bg-primary text-base-100" : "",
    "text-sm block"
  )}
  on:click={() => {
    toggleSelectTag(tag.id);
    isSelected = !isSelected;
  }}>{tag.name} {tag.count}</button
>
