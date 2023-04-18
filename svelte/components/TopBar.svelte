<script lang="ts">
  import Plus from "../assets/feather/Plus.svelte";
  import Modal from "./Modal.svelte";

  let showAddModal = false;

  const handleToggleAddModal = () => {
    showAddModal = !showAddModal;
  };
</script>

<div class="flex flex-row-reverse items-center h-full">
  <button on:click={handleToggleAddModal} class="w-4 h-4 mr-2 text-green-700">
    <Plus />
  </button>
</div>

<Modal open={showAddModal} on:close={handleToggleAddModal}>
  <div slot="body">
    <h1>Modal</h1>
  </div>
</Modal>
