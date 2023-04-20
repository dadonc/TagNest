<script lang="ts">
  import FileDragArea from "./FileDragArea.svelte";
  import {
    createItem,
    deleteItem,
    refreshDisplayedItems,
    type SingleItem,
  } from "../stores/items";
  import TagSelectWrapper from "./TagSelectWrapper.svelte";

  export let close: () => void;
  export let save: (tagString: string) => any = (_: string) => {};
  export let existingItem: SingleItem | null = null;

  export let isButtonDisabled = true;
  export let wasChanged: (tagsWerechanged?: boolean) => void = () => {};

  $: disabled = isButtonDisabled || (!name && !url && !path);

  $: {
    if (existingItem) {
      existingItem.name = name;
      existingItem.url = url;
      existingItem.note = note;
      if (existingItem.file) {
        existingItem.file.path = path;
      }
      wasChanged(tagString !== existingItem.tags.map((t) => t.name).join(", "));
    }
  }

  async function updateOrCreate() {
    if (existingItem) {
      save(tagString);
    } else {
      const newName = name ? name : namePlaceholder ? namePlaceholder : "";
      await createItem({ name: newName, url, note, path, tagString });
      refreshDisplayedItems();
      close();
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
</script>

<FileDragArea
  previewSrc={path ? "file://" + path : ""}
  on:file-chosen={(ev) => {
    const filePath = ev.detail;
    const name = filePath.split("/").pop();
    if (namePlaceholder === "Name" && name) {
      namePlaceholder = name;
    }
    path = filePath;
  }}
/>
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
<div class="flex justify-center mt-2 gap-x-2">
  <button class="btn btn-tertiary" on:click={close}>Cancel</button>
  <button {disabled} class="btn btn-primary" on:click={updateOrCreate}
    >Save</button
  >
</div>
{#if existingItem}
  <div class="flex justify-center">
    <button
      class="mt-16 btn btn-error"
      on:click={async () => {
        if (existingItem) {
          await deleteItem(existingItem.id);
          refreshDisplayedItems();
        }
      }}>Delete</button
    >
  </div>
{/if}
