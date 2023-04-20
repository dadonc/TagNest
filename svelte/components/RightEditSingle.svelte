<script lang="ts">
  import {
    type SingleItem,
    updateItem,
    refreshDisplayedItems,
  } from "../stores/items";
  import CreateOrEdit from "./CreateOrEdit.svelte";

  export let item: SingleItem;
  let originalItem = { ...item, file: item.file ? { ...item.file } : null };
  let isButtonDisabled = true;

  const save = async (tagString: string) => {
    await updateItem(item, tagString);
    if (item.file?.path) {
      if (item.file.path !== originalItem.file?.path) {
        refreshDisplayedItems();
      }
    }
  };
  const wasChanged = (tagsWereChanged = false) => {
    if (
      !tagsWereChanged &&
      JSON.stringify(item) === JSON.stringify(originalItem)
    ) {
      isButtonDisabled = true;
    } else {
      isButtonDisabled = false;
    }
  };
  const close = () => {
    item = { ...originalItem };
    if (item.file?.path !== originalItem.file?.path) {
      if (originalItem.file) {
        item.file = { ...originalItem.file };
      }
      refreshDisplayedItems();
    }
  };
</script>

{#key item}
  <h1 class="mt-2 mb-4 text-3xl text-center">Edit</h1>

  <CreateOrEdit
    {save}
    existingItem={item}
    {close}
    {isButtonDisabled}
    {wasChanged}
  />
{/key}
