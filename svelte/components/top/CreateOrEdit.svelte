<script lang="ts">
  import FileDragArea from "./FileDragArea.svelte";
  import {
    createItem,
    deleteItem,
    importItems,
    refreshDisplayedItems,
    type SingleItem,
  } from "../../stores/items";
  import TagSelectWrapper from "./TagSelectWrapper.svelte";
  import BookmarkPreviewImageChooser from "./BookmarkPreviewImageChooser.svelte";
  import { currentRoute } from "../../stores/stateStore";
  import startImportTasks from "../main/import/importQueue";
  import { tick } from "svelte";
  import VideoPreviewImageChooser from "./VideoPreviewImageChooser.svelte";
  import { saveVideoPreviewImage } from "../../utils";

  export let close: () => void;
  export let save: (tagString: string) => Promise<void> = async () => {};
  export let existingItem: SingleItem | undefined = undefined;
  export let isCreateNew = false;
  export let isButtonDisabled = true;
  export let wasChanged: (tagsWerechanged?: boolean) => void = () => {};

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
      wasChanged(tagString !== existingItem.tags.map((t) => t.name).join(", "));
    }
  }

  async function updateOrCreate() {
    let shouldReload = false;
    if (itemType === "video") {
      await saveVideoPreviewImage(path);
      shouldReload = true;
    }
    if (existingItem) {
      save(tagString);
    } else {
      const newName = name ? name : namePlaceholder ? namePlaceholder : "";
      const newItem = await createItem({
        name: newName,
        url,
        note,
        path,
        tagString,
        type: itemType,
        importStep: 1,
      });
      if (newItem) {
        $importItems = [...$importItems, newItem];
        await tick();
        startImportTasks();
      }
      close();
      if (!shouldReload) {
        refreshDisplayedItems();
      }
    }
    if (shouldReload) {
      window.location.reload();
    }
  }

  async function importItem() {
    if (existingItem) {
      $importItems = $importItems.map((i) => {
        if (existingItem && i.id === existingItem.id) {
          return { ...i, importStep: 1 };
        }
        return i;
      });
      await save(tagString);
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
      wasChanged(true);
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
    <button class="btn btn-primary" on:click={importItem}>Import</button>
  </div>
{:else}
  <div class="flex justify-center mt-2 gap-x-2">
    <button class="btn btn-tertiary" on:click={close}>Cancel</button>
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
