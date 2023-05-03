<script lang="ts">
  import Modal from "./Modal.svelte";
  import {
    getItem,
    updateItem,
    type SingleItem,
    refreshDisplayedItems,
  } from "../stores/items";
  import CreateOrEdit from "./CreateOrEdit.svelte";
  let isOpen = false;
  let item: SingleItem;

  const save = async (tagString: string) => {
    await updateItem(item, tagString);
    isOpen = false;
    refreshDisplayedItems();
  };

  window.electron.onOpenAddBookmark(async (_, { newItemId }) => {
    const newItem = await getItem(newItemId);
    if (newItem) {
      item = newItem;
      isOpen = true;
      console.log(item);
    }
  });

  const close = () => {
    isOpen = false;
  };
</script>

{#if isOpen}
  <Modal {isOpen} {close}>
    <div slot="body">
      <h1 class="mt-2 mb-4 text-3xl text-center">Add new item</h1>
      <CreateOrEdit
        {save}
        existingItem={item}
        {close}
        isButtonDisabled={false}
      />
    </div>
  </Modal>
{/if}
