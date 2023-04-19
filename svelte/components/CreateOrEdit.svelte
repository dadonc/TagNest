<script lang="ts">
  import FileDragArea from "./FileDragArea.svelte";
  import type { SingleItem } from "../stores/items";

  export let close: () => void;
  export let save: () => void;
  export let item: SingleItem | null = null;

  export let isButtonDisabled = true;
  export let wasChanged = () => {};

  $: disabled = isButtonDisabled || (!name && !url && !path);

  $: {
    if (item) {
      item.name = name;
      item.url = url;
      item.note = note;
      if (item.file) {
        item.file.path = path;
      }
      wasChanged();
    }
  }

  let name = item ? item.name : "";
  let namePlaceholder = name ? name : "Name";
  let url = item?.url ? item.url : "";
  let note = item?.note ? item.note : "";
  let path = item?.file?.path ? item.file.path : "";
</script>

<h1 class="mt-2 mb-4 text-3xl text-center">Add new item</h1>
<FileDragArea
  previewSrc={"file://" + path}
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
<textarea
  bind:value={note}
  placeholder="Notes"
  class="w-full h-32 mt-2 input input-bordered"
/>
<div class="flex justify-end mt-2 gap-x-2">
  <button class="btn btn-tertiary" on:click={close}>Cancel</button>
  <button {disabled} class="btn btn-primary" on:click={save}>Save</button>
</div>
