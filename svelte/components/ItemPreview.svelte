<script lang="ts">
  import type { SingleItem } from "../stores/items";
  import { state } from "../stores/stateStore";
  import { classNames } from "../utils";
  export let item: SingleItem;
  export let items: SingleItem[];

  $: itemIsSelected =
    $state.selectedItems.filter((id) => id === item.id).length > 0;

  function selectItem(event: MouseEvent | KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.metaKey) {
      itemIsSelected
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
    itemIsSelected ? "border border-blue-500" : "border border-transparent"
  )}
>
  <img src={"file://" + item.file?.path} alt="" />
</div>
