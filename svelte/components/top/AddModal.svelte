<script lang="ts">
  import Modal from "../Modal.svelte";
  import CreateOrEdit from "./CreateOrEdit.svelte";
  export let isOpen = false;
  export let close: () => void;
</script>

{#if isOpen}
  <Modal {isOpen} {close} isFullWidth={false}>
    <div slot="body" class="px-8 py-4 rounded bg-base-100">
      <h1 class="mb-4 text-3xl text-center">Add new item</h1>
      <CreateOrEdit isCreateNew={true} {close} />
    </div>
  </Modal>
{/if}
