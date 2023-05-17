<script lang="ts">
  import Modal from "../Modal.svelte";
  import CreateOrEdit from "./CreateOrEdit.svelte";
  export let isOpen = false;
  export let close: () => void;
</script>

{#if isOpen}
  <Modal {isOpen} {close}>
    <div slot="body">
      <h1 class="mt-2 mb-4 text-3xl text-center">Add new item</h1>
      <CreateOrEdit isCreateNew={true} {close} isButtonDisabled={false} />
    </div>
  </Modal>
{/if}
