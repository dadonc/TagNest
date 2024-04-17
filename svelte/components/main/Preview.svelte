<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { selectedItems, currentRoute } from "../../stores/stateStore";
  import {
    classNames,
    openContextMenu,
    possibylCloseContextMenu,
  } from "../../utils";
  import useIntersectionObserver from "../useIntersectionObserver";
  import PreviewChooser from "./PreviewChooser.svelte";

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

  let intersects = false;
  let isDetailView = $currentRoute === "details";

  let maxHeightStyle =
    $currentRoute == "details"
      ? "height: calc(var(--bottomContainer) - var(--bottomAreaPadding) * 2 - 1rem)"
      : "";

  function openMainContextMenu(event: MouseEvent) {
    if (!isItemSelected) {
      selectItem(event);
    }
    openContextMenu(event, "items");
  }
</script>

<div
  style="scroll-margin-top: 0.25rem;"
  id={item.id}
  use:useIntersectionObserver={isDetailView ? "bottomArea" : "mainArea"}
  on:enterViewport={() => {
    intersects = true;
  }}
  on:exitViewport={() => {
    intersects = false;
  }}
  on:click={(e) => {
    selectItem(e);
    possibylCloseContextMenu(e);
  }}
  on:dblclick={(e) => {
    selectItem(e);
    if ($selectedItems.ids.length === 1) {
      const clickedItem = items.find((i) => i.id === item.id);
      if (clickedItem && clickedItem.type === "external") return;
    }
    $currentRoute = "details";
  }}
  on:keydown={() => {}}
  on:contextmenu={openMainContextMenu}
  class={classNames(
    "h-full flex items-center justify-center w-full border-2 select-none ",
    !isDetailView ? "previewContainer" : "",
    isItemSelected ? "border-blue-500" : "border-transparent"
  )}
>
  {#if intersects}
    <div
      class={classNames(
        "h-full w-full border flex items-center justify-center",
        isItemSelected ? "border-transparent" : "border-base-300"
      )}
    >
      <PreviewChooser {item} {maxHeightStyle} />
    </div>
  {/if}
</div>
