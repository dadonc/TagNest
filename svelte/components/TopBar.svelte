<script lang="ts">
  import Plus from "../assets/feather/Plus.svelte";
  import AddModal from "./AddModal.svelte";

  let showAddModal = false;

  const handleToggleAddModal = () => {
    showAddModal = !showAddModal;
  };

  window.electron.onOpenAddItem(() => {
    showAddModal = true;
  });
</script>

<div class="flex flex-row-reverse items-center h-full">
  <button on:click={handleToggleAddModal} class="w-4 h-4 mr-2 text-green-700">
    <Plus />
  </button>
</div>

<AddModal isOpen={showAddModal} close={handleToggleAddModal} />
