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

  const save = () => {
    updateItem(item);
    if (item.file?.path) {
      if (item.file.path !== originalItem.file?.path) {
        refreshDisplayedItems();
      }
    }
  };
  const wasChanged = () => {
    if (JSON.stringify(item) === JSON.stringify(originalItem)) {
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
  <CreateOrEdit {save} {item} {close} {isButtonDisabled} {wasChanged} />
{/key}
