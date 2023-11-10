<script lang="ts">
  import Modal from "../Modal.svelte";
  import CreateOrEdit from "./CreateOrEdit.svelte";
  export let isOpen = false;
  export let close: () => void;
</script>

{#if isOpen}
  <Modal {isOpen} {close}>
    <div slot="body" class="px-8 py-2 bg-base-100">
      <h1 class="mt-2 mb-4 text-3xl text-center">Add new item</h1>
      <CreateOrEdit isCreateNew={true} {close} />
    </div>
  </Modal>
{/if}
