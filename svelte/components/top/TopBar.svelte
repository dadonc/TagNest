<script lang="ts">
  import Plus from "../../assets/feather/Plus.svelte";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";
  import { currentRoute, selectedItems } from "../../stores/stateStore";
  import { importItems } from "../../stores/items";
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
    {#if $currentRoute !== "main"}
      <button
        on:click={() => {
          $currentRoute = "main";
          selectedItems.set({ ids: [] });
        }}
        class="p-2"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    {/if}
  </div>
  <div class="flex items-center h-4 text-xs">
    <span>
      {#if $importItems.length > 0}
        <button
          on:click={() => {
            if ($currentRoute !== "importMultiple") {
              $currentRoute = "importMultiple";
              selectedItems.set({ ids: [] });
            }
          }}
          class="mr-4"
        >
          Import: {$importItems.length}
        </button>
      {/if}
    </span>
    <button on:click={handleToggleAddModal} class="w-4 h-4 mr-2 text-green-700">
      <Plus />
    </button>
  </div>
</div>

<AddModal isOpen={showAddModal} close={handleToggleAddModal} />
<AddBookmarkModal />
