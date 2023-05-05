<script lang="ts">
  import Plus from "../../assets/feather/Plus.svelte";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";

  import { currView } from "../../stores/stateStore";
  import AddBookmarkModal from "./AddBookmarkModal.svelte";
  import AddModal from "./AddModal.svelte";

  let showAddModal = false;

  const handleToggleAddModal = () => {
    showAddModal = !showAddModal;
  };

  window.electron.onOpenAddItem(() => {
    showAddModal = true;
  });
</script>

<div class="flex items-center justify-between h-full">
  <div class="flex items-center">
    <div class="inline-block" style="width: var(--leftContainer)" />
    {#if $currView.route !== "main"}
      <button on:click={() => ($currView.route = "main")} class="p-2">
        <ChevronLeft className="h-4 w-4" />
      </button>
    {/if}
  </div>
  <button on:click={handleToggleAddModal} class="w-4 h-4 mr-2 text-green-700">
    <Plus />
  </button>
</div>

<AddModal isOpen={showAddModal} close={handleToggleAddModal} />
<AddBookmarkModal />
