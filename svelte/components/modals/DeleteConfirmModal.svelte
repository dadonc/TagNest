<script lang="ts">
  import AlertTriangle from "../../assets/feather/AlertTriangle.svelte";
  import type { SingleItem } from "../../stores/items";
  import {
    contextMenuStore,
    filteredData,
    settingsJson,
  } from "../../stores/stateStore";
  import PreviewChooser from "../main/PreviewChooser.svelte";
  import { addToDeleteQueue } from "../main/delete/DeleteQueue";
  import Modal from "./Modal.svelte";

  let itemsToDelete: SingleItem[] = [];
  let deleteButton: HTMLButtonElement;

  let deleteFileCheckbox: HTMLInputElement;

  $: if ($contextMenuStore.isDeleteModalOpen) {
    async function temp() {
      itemsToDelete = (await $filteredData).items.filter((item) =>
        $contextMenuStore.idsToDelete.includes(item.id)
      );
    }
    temp();
    if (deleteButton) deleteButton.focus();
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
      {#if itemsToDelete.length > 1}
        <ul class="my-4">
          {#each itemsToDelete as item}
            <li>{item.name}</li>
          {/each}
        </ul>
      {:else if itemsToDelete.length === 1}
        <div class="flex flex-col items-center justify-center my-4">
          <PreviewChooser
            item={itemsToDelete[0]}
            hideName={false}
            maxHeightStyle="max-height: 8rem;"
          />
          <!-- Should this be shown for some item types? -->
          <!-- {itemsToDelete[0].name} -->
        </div>
      {/if}
      <label class="block mt-4 select-none">
        <input
          type="checkbox"
          bind:this={deleteFileCheckbox}
          checked={$settingsJson?.combineBehavior === "copy"}
        />
        <span class="ml-1">
          {#if itemsToDelete.length === 1}
            Delete file
            <span class="text-xs text-gray-500"
              >{itemsToDelete[0].file?.path}</span
            >
          {:else}
            Delete files
          {/if}
        </span>
      </label>
      <div class="mt-2 mb-4 text-center">
        This file was
        {#if $settingsJson.combineBehavior === "copy"}
          <span class="font-bold">copied</span> to
        {:else if $settingsJson.combineBehavior === "move"}
          <span class="font-bold">moved</span> to
        {:else if $settingsJson.combineBehavior === "separate"}
          <span class="font-bold">is not in</span>
        {/if}
        the database folder.
      </div>
      <div class="flex flex-col items-center justify-center">
        <button class="btn" on:click={closeAndReset}>Cancel</button>
        <button
          class="p-1 mt-4 text-red-600 hover:text-red-800"
          bind:this={deleteButton}
          on:click={() => {
            addToDeleteQueue(
              $contextMenuStore.idsToDelete,
              deleteFileCheckbox.checked
            );
            closeAndReset();
          }}
          >Delete {itemsToDelete.length}
          {itemsToDelete.length === 1 ? "item" : "items"}</button
        >
      </div>
    </div>
  </Modal>
{/if}

<style>
  ul {
    padding-left: 20px; /* Adjust as necessary */
    list-style: none; /* Remove default bullets */
  }
  ul li::before {
    content: "•"; /* Custom bullet */
    margin-right: 10px; /* Space between bullet and text */
  }
  li {
    display: flex;
    align-items: baseline; /* Align the bullet and text */
  }
</style>
