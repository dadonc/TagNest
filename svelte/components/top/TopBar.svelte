<script lang="ts">
  import Plus from "../../assets/feather/Plus.svelte";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";
  import {
    currentRoute,
    currView,
    selectedItems,
  } from "../../stores/stateStore";

  import { importItems } from "../../stores/items";
  import AddBookmarkModal from "../modals/AddBookmarkModal.svelte";
  import AddModal from "../modals/AddModal.svelte";
  import LoaderCircle from "./LoaderCircle.svelte";
  import ItemOrder from "./ItemOrder.svelte";
  import QuickSettings from "./QuickSettings.svelte";
  import ImportProgressModal from "../modals/ImportProgressModal.svelte";
  import { onMount } from "svelte";

  let showAddModal = false;
  let isImportProgressModalOpen = false;
  let searchInput: HTMLInputElement;

  onMount(() => {
    $currView.searchString = "";
  });

  const handleToggleAddModal = () => {
    showAddModal = !showAddModal;
  };

  window.electron.onOpenAddItem(() => {
    showAddModal = true;
  });

  $: countImportFinished =
    $importItems.filter((i) => i.importFinished).length + 1;
  $: countImportTotal = $importItems.length;

  $: importedCountDisplay =
    countImportFinished > countImportTotal
      ? countImportTotal
      : countImportFinished;
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
    {/if}
    <div class="relative">
      <input
        type="text"
        id="searchInput"
        placeholder="Search..."
        class="w-32 p-0 ml-4 text-sm border-t-0 border-l-0 border-r-0 select-none placeholder-base-content bg-base-300 border-base-content focus:border-primary focus:ring-0"
        bind:this={searchInput}
        on:change={(event) => {
          //@ts-ignore
          $currView.searchString = event.target.value;
        }}
      />
      {#if $currView.searchString}
        <button
          class="absolute top-0 bottom-0 text-sm text-primary focus:ring-0 focus:border-none focus:outline-none focus:text-primary right-1"
          on:click={() => {
            $currView.searchString = "";
            searchInput.value = "";
          }}>Clear</button
        >
      {/if}
    </div>
  </div>
  <div class="flex items-center h-4 text-xs">
    <span class="flex justify-center h-4">
      {#if $importItems.length > 0}
        <LoaderCircle />
        <button
          on:click={() => (isImportProgressModalOpen = true)}
          class="ml-1 mr-4 font-bold"
        >
          Importing: {importedCountDisplay}/{$importItems.length}
        </button>
        <ImportProgressModal bind:isOpen={isImportProgressModalOpen} />
      {/if}
    </span>
    <!-- <button
      title="Add item"
      on:click={handleToggleAddModal}
      class="w-4 h-4 mr-4 text-base-content"
    >
      <Plus />
    </button> -->
    <button
      title="Add item"
      class="h-8 mr-4 text-sm font-normal capitalize rounded hover:bg-base-300 hover:text-primary hover:border-primary btn btn-outline btn-sm text-base-content"
      on:click={handleToggleAddModal}
    >
      Import
      <span class="inline-block w-4 h-4 ml-2">
        <Plus />
      </span>
    </button>
  </div>
</div>

<AddModal isOpen={showAddModal} close={handleToggleAddModal} />
<AddBookmarkModal />
