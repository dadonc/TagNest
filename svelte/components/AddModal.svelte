<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Modal from "./Modal.svelte";
  export let isOpen = false;
  export let close: () => void;
</script>

{#if isOpen}
  <Modal {isOpen} {close}>
    <div slot="body" class="flex flex-col justify-between w-full h-full">
      <div>
        <h1>Add new item</h1>
        <label for="name">Name</label>
        <input type="text" id="name" />
      </div>
      <div class="flex justify-end gap-x-2">
        <button class="btn btn-tertiary" on:click={close}>Cancel</button>
        <button class="btn btn-primary" on:click={close}>Save</button>
      </div>
    </div>
  </Modal>
{/if}
