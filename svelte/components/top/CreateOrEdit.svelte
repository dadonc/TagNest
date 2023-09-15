<!-- TODO - This is a mess. Refactor this whole file -->
<script lang="ts">
  import FileDragArea from "./FileDragArea.svelte";
  import {
    createItem,
    deleteItem,
    importItems,
    refreshDisplayedItems,
    updateItem,
    type SingleItem,
  } from "../../stores/items";
  import TagSelectWrapper from "./TagSelectWrapper.svelte";
  import BookmarkPreviewImageChooser from "./BookmarkPreviewImageChooser.svelte";
  import { currentRoute } from "../../stores/stateStore";
  import startImportTasks from "../main/import/importQueue";
  import { tick } from "svelte";
  import VideoPreviewImageChooser from "./VideoPreviewImageChooser.svelte";
  import { saveVideoPreviewImage } from "../../utils";

  export let originalItem: SingleItem | undefined = undefined;
  const existingItem = originalItem
    ? {
        ...originalItem,
        file: originalItem.file ? { ...originalItem.file } : null,
      }
    : undefined;
  export let isCreateNew = false;

  let wasVideoPreviewUpdated = false;
  let isButtonDisabled = true;
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

      isButtonDisabled =
        JSON.stringify(originalItem) === JSON.stringify(existingItem) &&
        tagString === originalItem?.tags.map((t) => t.name).join(", ");
    }
  }

  async function updateOrCreate() {
    let shouldReload = false;
    if (existingItem) {
      if (itemType === "video") {
        if (wasVideoPreviewUpdated) {
          await saveVideoPreviewImage(path);
          shouldReload = true;
        }
      }
      if (existingItem.type === "bookmark") {
        // why need bookmarks reloading?
        shouldReload = true;
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
        type: itemType,
        importStep: 0,
      });
      if (newItem) {
        $importItems = [...$importItems, newItem];
        await tick();
        startImportTasks();
      }
      close();
      if (!shouldReload) {
        // todo look into this
        // refreshDisplayedItems();
      }
    }
    if (shouldReload) {
      // todo look into this
      window.location.reload();
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
</script>

{#if existingItem?.type === "bookmark"}
  <BookmarkPreviewImageChooser
    item={existingItem}
    {path}
    on:image-chosen={(ev) => {
      path = ev.detail.image;
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
{:else}
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
{/if}
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
          await deleteItem(existingItem.id);
          refreshDisplayedItems();
        }
      }}>Delete</button
    >
  </div>
  <div class="h-4" />
{/if}
