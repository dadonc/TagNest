<!-- TODO - This is a mess. Refactor this whole file -->
<script lang="ts">
  import FileDragArea from "./FileDragArea.svelte";
  import {
    createItem,
    importItems,
    refreshDisplayedItems,
    updateItem,
    type SingleItem,
    updateBookmarkPreviewImage,
  } from "../../stores/items";
  import TagSelectWrapper from "./TagSelectWrapper.svelte";
  import BookmarkPreviewImageChooser from "./BookmarkPreviewImageChooser.svelte";
  import { currentRoute } from "../../stores/stateStore";
  import startImportTasks from "../main/import/importQueue";
  import { tick } from "svelte";
  import VideoPreviewImageChooser from "./VideoPreviewImageChooser.svelte";
  import { saveVideoPreviewImage } from "../../utils";
  import { getItemTypeFromExtension } from "../../../src/gschert";
  import { addToDeleteQueue } from "../main/delete/DeleteQueue";

  export let originalItem: SingleItem | undefined = undefined;
  const existingItem = originalItem
    ? {
        ...originalItem,
        file: originalItem.file ? { ...originalItem.file } : null,
      }
    : undefined;
  export let isCreateNew = false;
  export let close: () => void = () => {};

  let wasVideoPreviewUpdated = false;
  let isButtonDisabled = !isCreateNew;
  $: disabled = isButtonDisabled || (!name && !url && !path);

  $: {
    if (existingItem) {
      existingItem.name = name;
      existingItem.url = url;
      existingItem.note = note;
      existingItem.type = itemType;
      if (existingItem.file) {
        existingItem.file.path = path;
      } else {
        // @ts-ignore
        existingItem.file = {
          path,
        };
      }
      if (existingItem.bookmark) {
        existingItem.bookmark.previewImagePath = bookmarkPreviewImagePath;
      }

      isButtonDisabled =
        JSON.stringify(originalItem) === JSON.stringify(existingItem) &&
        tagString === originalItem?.tags.map((t) => t.name).join(", ");
    }
  }

  async function updateOrCreate() {
    if (existingItem) {
      if (itemType === "video") {
        if (wasVideoPreviewUpdated) {
          await saveVideoPreviewImage(path);
          const previewImg = document.getElementById(
            `previewImage-${existingItem.id}`
          ) as HTMLImageElement;
          previewImg.src = previewImg.src + "?" + Date.now();
        }
      }
      if (isCreateNew) {
        close();
      }
      await updateItem(existingItem, tagString);
      refreshDisplayedItems();
    } else {
      const newName = name ? name : namePlaceholder ? namePlaceholder : "";
      const newItem = await createItem({
        name: newName,
        url,
        note,
        path,
        tagString,
        type: itemType
          ? itemType
          : getItemTypeFromExtension(path.split(".").pop()),
        importStep: 0,
      });
      if (newItem) {
        $importItems = [...$importItems, newItem];
        await tick();
        startImportTasks();
      }
      close();
    }
  }

  async function startItemsImport() {
    if (existingItem) {
      $importItems = $importItems.map((i) => {
        if (existingItem && i.id === existingItem.id) {
          return { ...i, importStep: 0 };
        }
        return i;
      });
      await updateItem(existingItem, tagString);
      startImportTasks();
    }
  }

  let name = existingItem ? existingItem.name : "";
  let namePlaceholder = name ? name : "Name";
  let url = existingItem?.url ? existingItem.url : "";
  let tagString = existingItem
    ? existingItem.tags.map((t) => t.name).join(", ")
    : "";
  let note = existingItem?.note ? existingItem.note : "";
  let path = existingItem?.file?.path ? existingItem.file.path : "";
  let itemType = existingItem?.type ? existingItem.type : "";
  let bookmarkPreviewImagePath = existingItem?.bookmark?.previewImagePath
    ? existingItem.bookmark.previewImagePath
    : "";
</script>

<div class="flex items-center justify-center">
  <div class="w-1/2 text-center h-1/2">
    {#if existingItem?.type === "bookmark"}
      <BookmarkPreviewImageChooser
        item={existingItem}
        on:image-chosen={(ev) => {
          bookmarkPreviewImagePath = ev.detail.newPreviewPath;
          disabled = false;
        }}
      />
    {:else if existingItem?.type === "video" || itemType === "video"}
      <VideoPreviewImageChooser
        {isCreateNew}
        videoPath={path}
        on:image-chosen={(ev) => {
          isButtonDisabled = false;
          wasVideoPreviewUpdated = true;
        }}
      />
    {:else if isCreateNew}
      <FileDragArea
        previewSrc={path ? "file://" + path : ""}
        on:close-modal={close}
        on:file-chosen={(ev) => {
          itemType = ev.detail.itemType;
          const name = ev.detail.path.split("/").pop();
          if (namePlaceholder === "Name" && name) {
            namePlaceholder = name;
          }
          path = ev.detail.path;
        }}
      />
    {:else if existingItem?.type === "image" && existingItem?.file?.path}
      <img src={"file://" + existingItem.file.path} alt="" class="m-auto" />
    {:else if existingItem}
      <div class="mb-2">
        Type: {existingItem.type}
      </div>
    {/if}
  </div>
</div>
<input
  bind:value={name}
  type="text"
  placeholder={namePlaceholder}
  class="w-full mt-2 input input-bordered"
/>
<input
  bind:value={url}
  type="text"
  placeholder="URL"
  class="w-full mt-2 input input-bordered"
/>
<TagSelectWrapper bind:tagString />
<textarea
  bind:value={note}
  placeholder="Notes"
  class="w-full h-32 mt-2 input input-bordered"
/>
{#if $currentRoute === "importMultiple"}
  <div class="flex justify-center mt-2 gap-x-2">
    <button class="btn btn-primary" on:click={startItemsImport}>Import</button>
  </div>
{:else}
  <div class="flex justify-center mt-2 gap-x-2">
    {#if !existingItem}
      <button class="btn btn-tertiary" on:click={close}>Cancel</button>
    {/if}
    <button {disabled} class="btn btn-primary" on:click={updateOrCreate}
      >Save</button
    >
  </div>
{/if}
{#if existingItem}
  <div class="flex justify-center">
    <button
      class="mt-16 btn btn-error"
      on:click={async () => {
        if (existingItem) {
          // TODO ask Chris - why do I need this?
          const existingItemId = existingItem.id;
          $importItems = $importItems.filter((i) => i.id !== existingItemId);
          if (isCreateNew) {
            // add newly created bookmark to the items store for the deletion process
            await refreshDisplayedItems();
          }
          addToDeleteQueue([existingItem.id]);
          close();
        }
      }}>Delete</button
    >
  </div>
  <div class="h-4" />
{/if}
