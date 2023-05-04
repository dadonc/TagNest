<script lang="ts">
  import {
    type SingleItem,
    refreshDisplayedItems,
    deleteItems,
  } from "../../stores/items";
  import { selectedItems } from "../../stores/stateStore";
  import { updateItemsTags } from "../../stores/tags";
  import TagSelectWrapper from "../top/TagSelectWrapper.svelte";

  export let items: SingleItem[];

  const sharedTags = $selectedItems.ids
    .map((id) => items.find((item) => item.id === id))
    .reduce((acc, item) => {
      if (item) {
        if (acc.length === 0) {
          return item.tags.map((tag) => tag.name);
        }
        return acc.filter((tagName) =>
          item.tags.map((tag) => tag.name).includes(tagName)
        );
      }
      return acc;
    }, [] as string[]);

  const originalTagString = sharedTags.join(", ");
  let tagString = sharedTags.join(", ");

  $: isSaveButtonDisabled = tagString === originalTagString;

  const save = async () => {
    await updateItemsTags($selectedItems.ids, tagString);
    isSaveButtonDisabled = true;
    refreshDisplayedItems();
  };
  const close = () => {
    refreshDisplayedItems();
  };
</script>

<h1 class="mt-2 mb-4 text-3xl text-center">Edit</h1>
<div class="text-center">
  Selected <span class="font-bold">{$selectedItems.ids.length}</span> items
</div>
<TagSelectWrapper bind:tagString />

<div class="flex justify-center mt-2 gap-x-2">
  <button class="btn btn-tertiary" on:click={close}>Cancel</button>
  <button
    disabled={isSaveButtonDisabled}
    class="btn btn-primary"
    on:click={save}>Save</button
  >
</div>
<div class="flex justify-center">
  <button
    class="mt-16 btn btn-error"
    on:click={async () => {
      await deleteItems($selectedItems.ids);
      refreshDisplayedItems();
    }}>Delete</button
  >
</div>
