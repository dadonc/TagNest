<script lang="ts">
  import AlertTriangle from "../../assets/feather/AlertTriangle.svelte";
  import type { SingleItem } from "../../stores/items";
  import { contextMenuStore, filteredData } from "../../stores/stateStore";
  import { addToDeleteQueue } from "../main/delete/DeleteQueue";
  import Modal from "./Modal.svelte";

  let itemsToDelete: SingleItem[] = [];
  $: if ($contextMenuStore.isDeleteModalOpen) {
    async function temp() {
      itemsToDelete = (await $filteredData).items.filter((item) =>
        $contextMenuStore.idsToDelete.includes(item.id)
      );
    }
    temp();
  }

  function closeAndReset() {
    $contextMenuStore.idsToDelete = [];
    $contextMenuStore.isDeleteModalOpen = false;
  }
</script>

{#if $contextMenuStore.isDeleteModalOpen}
  <Modal
    isOpen={$contextMenuStore.isDeleteModalOpen}
    close={closeAndReset}
    isFullWidth={false}
  >
    <div slot="body" class="px-8 py-4 rounded bg-base-100">
      <h1
        class="flex items-center justify-between mt-2 mb-2 text-xl text-center"
      >
        <AlertTriangle className="w-8 h-8 mr-6 inline-block text-red-600" />
        <div>
          {#if itemsToDelete.length === 1}
            <div>Are you sure you want to delete this item?</div>
          {:else}
            <div>
              Are you sure you want to delete these <br />
              <span class="font-bold">{itemsToDelete.length}</span> items?
            </div>
          {/if}

          <div class="mt-1 text-xs text-gray-500">
            This action cannot be undone.
          </div>
        </div>
        <AlertTriangle className="w-8 h-8 ml-6 inline-block text-red-600" />
      </h1>
      <ul class="my-4 text-center list-disc list-inside">
        {#each itemsToDelete as item}
          <li>{item.name}</li>
        {/each}
      </ul>
      <div class="flex flex-col items-center justify-center">
        <button class="btn" on:click={closeAndReset}>Cancel</button>
        <button
          class="mt-4 text-red-600 hover:text-red-800"
          on:click={() => {
            addToDeleteQueue($contextMenuStore.idsToDelete);
            closeAndReset();
          }}
          >Delete {itemsToDelete.length}
          {itemsToDelete.length === 1 ? "item" : "items"}</button
        >
      </div>
    </div>
  </Modal>
{/if}
