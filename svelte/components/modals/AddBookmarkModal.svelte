<script lang="ts">
  import Modal from "./Modal.svelte";
  import {
    getItem,
    refreshDisplayedItems,
    type SingleItem,
  } from "../../stores/items";
  import CreateOrEdit from "./components/CreateOrEdit.svelte";
  import { confirmDelete } from "../main/delete/DeleteQueue";
  import { onMount } from "svelte";
  let isOpen = false;
  let item: SingleItem;

  onMount(() => {
    window.electron.onOpenAddBookmark(async (_, { newItemId }) => {
      const newItem = await getItem(newItemId);
      if (newItem) {
        item = newItem;
        isOpen = true;
      }
    });
  });

  const close = async () => {
    isOpen = false;
    // add newly created bookmark to the items store for the deletion process
    await refreshDisplayedItems();
    confirmDelete([item.id]);
  };

  const closeAfterSave = async () => {
    isOpen = false;
  };
</script>

{#if isOpen}
  <Modal {isOpen} {close} isFullWidth={false}>
    <div slot="body" class="px-8 py-4 rounded bg-base-100">
      <h1 class="mt-2 mb-2 text-3xl text-center">Add new item</h1>
      <CreateOrEdit originalItem={item} close={closeAfterSave} isCreateNew />
    </div>
  </Modal>
{/if}
