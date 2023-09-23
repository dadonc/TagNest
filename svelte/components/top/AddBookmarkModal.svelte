<script lang="ts">
  import Modal from "../Modal.svelte";
  import {
    getItem,
    refreshDisplayedItems,
    type SingleItem,
  } from "../../stores/items";
  import CreateOrEdit from "./CreateOrEdit.svelte";
  import { addToDeleteQueue } from "../main/delete/DeleteQueue";
  let isOpen = false;
  let item: SingleItem;

  window.electron.onOpenAddBookmark(async (_, { newItemId }) => {
    const newItem = await getItem(newItemId);
    if (newItem) {
      item = newItem;
      isOpen = true;
    }
  });

  const close = async () => {
    isOpen = false;
    // add newly created bookmark to the items store for the deletion process
    await refreshDisplayedItems();
    addToDeleteQueue([item.id]);
  };

  const closeAfterSave = async () => {
    isOpen = false;
  };
</script>

{#if isOpen}
  <Modal {isOpen} {close}>
    <div slot="body">
      <h1 class="mt-2 mb-4 text-3xl text-center">Add new item</h1>
      <CreateOrEdit originalItem={item} close={closeAfterSave} isCreateNew />
    </div>
  </Modal>
{/if}
