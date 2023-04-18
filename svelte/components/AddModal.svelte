<script lang="ts">
  import Modal from "./Modal.svelte";
  import FileDragArea from "./FileDragArea.svelte";
  import { createItem } from "../stores/items";
  export let isOpen = false;
  export let close: () => void;

  function save() {
    const newTitle = title ? title : titlePlaceholder ? titlePlaceholder : "";
    createItem({ title: newTitle, url, note, path });
    close();
  }

  $: disabled = !title && !url && !path;

  let title = "";
  let titlePlaceholder = "Title";
  let url = "";
  let note = "";
  let path = "";
</script>

{#if isOpen}
  <Modal {isOpen} {close}>
    <div slot="body">
      <h1 class="mt-2 mb-4 text-3xl text-center">Add new item</h1>
      <FileDragArea
        on:file-chosen={(ev) => {
          const filePath = ev.detail;
          const name = filePath.split("/").pop();
          if (titlePlaceholder === "Title" && name) {
            titlePlaceholder = name;
          }
          path = filePath;
        }}
      />
      <input
        bind:value={title}
        type="text"
        placeholder={titlePlaceholder}
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
    </div></Modal
  >
{/if}
