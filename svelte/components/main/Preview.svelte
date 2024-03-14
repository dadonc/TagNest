<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import {
    selectedItems,
    currentRoute,
    contextMenuStore,
  } from "../../stores/stateStore";
  import { classNames, possibylCloseContextMenu } from "../../utils";
  import useIntersectionObserver from "../useIntersectionObserver";
  import PreviewAudio from "./PreviewAudio.svelte";
  import BookmarkPreview from "./PreviewBookmark.svelte";
  import ImagePreview from "./PreviewImage.svelte";
  import PreviewPdf from "./PreviewPDF.svelte";
  import PreviewText from "./PreviewText.svelte";
  import PreviewVideo from "./PreviewVideo.svelte";
  import PreviewExternal from "./PreviewExternal.svelte";

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
      ? "max-height: calc(var(--bottomContainer) - var(--bottomAreaPadding) * 2 - 1rem)"
      : "";

  function openContextMenu(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();

    if (!isItemSelected) {
      selectItem(event);
    }
    $contextMenuStore.x = event.clientX;
    $contextMenuStore.y = event.clientY;
    $contextMenuStore.isContextMenuOpen = true;
  }
</script>

<div
  style="scroll-margin-top: 0.5rem;"
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
  on:contextmenu={openContextMenu}
  class={classNames(
    "flex items-center justify-center h-full w-full border-4 ",
    isItemSelected ? "border-blue-500" : "border-transparent"
  )}
>
  {#if intersects}
    {#if item.type === "image"}
      <ImagePreview {item} {maxHeightStyle} />
    {:else if item.type === "bookmark"}
      <BookmarkPreview {item} {maxHeightStyle} />
    {:else if item.type === "pdf"}
      <PreviewPdf {item} {maxHeightStyle} />
    {:else if item.type === "video"}
      <PreviewVideo {item} {maxHeightStyle} />
    {:else if item.type === "audio"}
      <PreviewAudio {item} {maxHeightStyle} />
    {:else if item.type === "text"}
      <PreviewText {item} {maxHeightStyle} />
    {:else if item.type === "external"}
      <PreviewExternal {item} {maxHeightStyle} />
    {:else}
      <div class="flex flex-col items-center justify-center h-full bg-base-300">
        <div class="text-sm text-gray-500">Unknown file type</div>
        <div class="text-sm text-gray-500">{item.name}</div>
      </div>
    {/if}
  {/if}
</div>
