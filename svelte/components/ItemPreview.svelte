<script lang="ts">
  import type { SingleItem } from "../stores/items";
  import { state } from "../stores/stateStore";
  import { classNames } from "../utils";
  export let item: SingleItem;

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
