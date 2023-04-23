<script lang="ts">
  import type { SingleItem } from "../stores/items";
  import { state } from "../stores/stateStore";
  import { classNames } from "../utils";
  import ImagePreview from "./ImagePreview.svelte";
  export let item: SingleItem;
  export let items: SingleItem[];

  $: isItemSelected =
    $state.selectedItems.filter((id) => id === item.id).length > 0;

  function selectItem(event: MouseEvent | KeyboardEvent) {
    if (
      (event.target as HTMLElement).matches(".hoverDisplay, .hoverDisplay *")
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (event.metaKey) {
      isItemSelected
        ? ($state.selectedItems = $state.selectedItems.filter(
            (id) => id !== item.id
          ))
        : ($state.selectedItems = [...$state.selectedItems, item.id]);
    } else if (event.shiftKey) {
      const itemIndex = items.indexOf(item);
      const firstSelectedItemIndex = items.findIndex(
        (item) => item.id === $state.selectedItems[0]
      );
      const lastSelectedItemIndex = items.findIndex(
        (item) =>
          item.id === $state.selectedItems[$state.selectedItems.length - 1]
      );
      if (itemIndex < firstSelectedItemIndex) {
        $state.selectedItems = items
          .slice(itemIndex, firstSelectedItemIndex + 1)
          .map((item) => item.id);
      } else if (itemIndex > lastSelectedItemIndex) {
        $state.selectedItems = items
          .slice(lastSelectedItemIndex, itemIndex + 1)
          .map((item) => item.id);
      } else {
        $state.selectedItems = items
          .slice(firstSelectedItemIndex, itemIndex + 1)
          .map((item) => item.id);
      }
    } else {
      $state.selectedItems = [item.id];
    }
  }
</script>

<div
  on:click={selectItem}
  on:keydown={(e) => {
    if (e.key === "Enter") {
      selectItem(e);
    }
  }}
  class={classNames(
    isItemSelected ? "border border-blue-500" : "border border-transparent"
  )}
>
  {#if item.file?.type === "image"}
    <ImagePreview {item} />
  {:else}
    <div class="flex flex-col items-center justify-center h-full">
      <div class="text-2xl text-gray-500">
        <i class="fas fa-file" />
      </div>
      <div class="text-sm text-gray-500">{item.name}</div>
    </div>
  {/if}
</div>
