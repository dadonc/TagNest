<script lang="ts">
  import Plus from "../../assets/feather/Plus.svelte";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";
  import { currentRoute, selectedItems } from "../../stores/stateStore";
  import { items } from "../../stores/items";

  import { importItems } from "../../stores/items";
  import AddBookmarkModal from "./AddBookmarkModal.svelte";
  import AddModal from "./AddModal.svelte";
  import LoaderCircle from "./LoaderCircle.svelte";
  import ShuffleIcon from "../../assets/feather/ShuffleIcon.svelte";
  import ItemOrder from "./ItemOrder.svelte";
  import QuickSettings from "./QuickSettings.svelte";

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

  async function shuffleItems() {
    function shuffleArray(array: any[]) {
      // https://stackoverflow.com/a/12646864
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    $items = shuffleArray($items);
  }
</script>

<div class="flex items-center justify-between h-full">
  <div class="flex items-center">
    <div
      class="inline-block"
      style="width: var(--leftContainer); min-width: 4.5rem;"
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
    {#if $currentRoute == "main"}
      <QuickSettings />
      <ItemOrder />
      <button on:click={shuffleItems} class="p-2" title="Shuffle items">
        <ShuffleIcon className="h-4 w-4 text-base-content" />
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
    <button
      title="Add item"
      on:click={handleToggleAddModal}
      class="w-4 h-4 mr-4 text-base-content"
    >
      <Plus />
    </button>
  </div>
</div>

<AddModal isOpen={showAddModal} close={handleToggleAddModal} />
<AddBookmarkModal />
