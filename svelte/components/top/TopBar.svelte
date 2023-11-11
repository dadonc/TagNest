<script lang="ts">
  import Plus from "../../assets/feather/Plus.svelte";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";
  import { currentRoute, selectedItems } from "../../stores/stateStore";
  import { importItems } from "../../stores/items";
  import AddBookmarkModal from "./AddBookmarkModal.svelte";
  import AddModal from "./AddModal.svelte";
  import LoaderCircle from "./LoaderCircle.svelte";

  let showAddModal = false;

  const handleToggleAddModal = () => {
    showAddModal = !showAddModal;
  };

  window.electron.onOpenAddItem(() => {
    showAddModal = true;
  });

  let initialImportItems = $importItems.length;
  $: {
    if ($importItems.length > initialImportItems) {
      initialImportItems = $importItems.length;
    }
  }
</script>

<div class="flex items-center justify-between h-full">
  <div class="flex items-center">
    <div
      class="inline-block"
      style="width: var(--leftContainer); min-width: 48px;"
    />
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
    <span class="flex justify-center h-4">
      {#if $importItems.length > 0}
        <LoaderCircle />
        <button
          on:click={() => {
            if ($currentRoute !== "importMultiple") {
              $currentRoute = "importMultiple";
              selectedItems.set({ ids: [] });
            }
          }}
          class="ml-1 mr-4 font-bold"
        >
          Importing: {initialImportItems -
            $importItems.length +
            1}/{initialImportItems}
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
