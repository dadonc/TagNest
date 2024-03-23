<script lang="ts">
  import Modal from "../Modal.svelte";
  import CreateOrEdit from "./CreateOrEdit.svelte";
  export let isOpen = false;
  export let close: () => void;

  let isCreateNew = true;

  function closeAndReset() {
    close();
    isCreateNew = true;
  }
</script>

{#if isOpen}
  <Modal {isOpen} close={closeAndReset} isFullWidth={false}>
    <div slot="body" class="px-8 py-4 rounded bg-base-100">
      <h1 class="mt-2 mb-2 text-3xl text-center">
        {isCreateNew ? "Add new item" : "Edit item"}
      </h1>
      <CreateOrEdit bind:isCreateNew close={closeAndReset} />
    </div>
  </Modal>
{/if}
