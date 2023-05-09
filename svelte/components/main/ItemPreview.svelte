<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { selectedItems, currentRoute } from "../../stores/stateStore";
  import { classNames } from "../../utils";
  import BookmarkPreview from "./BookmarkPreview.svelte";
  import ImagePreview from "./ImagePreview.svelte";
  export let item: SingleItem;
  export let items: SingleItem[];

  $: isItemSelected =
    $selectedItems.ids.filter((id) => id === item.id).length > 0;

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
        ? ($selectedItems.ids = $selectedItems.ids.filter(
            (id) => id !== item.id
          ))
        : ($selectedItems.ids = [...$selectedItems.ids, item.id]);
    } else if (event.shiftKey) {
      const itemIndex = items.indexOf(item);
      const firstSelectedItemIndex = items.findIndex(
        (item) => item.id === $selectedItems.ids[0]
      );
      const lastSelectedItemIndex = items.findIndex(
        (item) => item.id === $selectedItems.ids[$selectedItems.ids.length - 1]
      );
      if (itemIndex < firstSelectedItemIndex) {
        $selectedItems.ids = items
          .slice(itemIndex, firstSelectedItemIndex + 1)
          .map((item) => item.id);
      } else if (itemIndex > lastSelectedItemIndex) {
        $selectedItems.ids = items
          .slice(lastSelectedItemIndex, itemIndex + 1)
          .map((item) => item.id);
      } else {
        $selectedItems.ids = items
          .slice(firstSelectedItemIndex, itemIndex + 1)
          .map((item) => item.id);
      }
    } else {
      $selectedItems.ids = [item.id];
    }
  }
</script>

<div
  id={item.id}
  on:click={selectItem}
  on:dblclick={(e) => {
    selectItem(e);
    $currentRoute = "details";
  }}
  on:keydown={(e) => {
    if (e.key === "Enter") {
      selectItem(e);
    }
  }}
  class={classNames(
    isItemSelected ? "border border-blue-500" : "border border-transparent",
    "flex items-center justify-center"
  )}
>
  {#if item.type === "image"}
    <ImagePreview {item} />
  {:else if item.type === "bookmark"}
    <BookmarkPreview {item} />
  {:else}
    <div
      class="flex flex-col items-center justify-center h-full"
      on:dblclick={() => {
        if (item.file?.path)
          window.electron.openFileInDefaultApp(item.file?.path);
      }}
    >
      <div class="text-2xl text-gray-500">
        <i class="fas fa-file" />
      </div>
      <div class="text-sm text-gray-500">{item.name}</div>
    </div>
  {/if}
</div>
