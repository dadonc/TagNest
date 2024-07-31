<script lang="ts">
  import {
    type SingleItem,
    refreshDisplayedItems,
    importItems,
  } from "../../stores/items";
  import { selectedItems } from "../../stores/stateStore";
  import {
    addItemsTags,
    removeItemsTags,
    updateItemsTags,
  } from "../../stores/tags";
  import { confirmDelete } from "../main/delete/DeleteQueue";
  import TagSelectWrapper from "../modals/components/TagSelectWrapper.svelte";

  export let items: SingleItem[];
  export const modalClose: () => void = () => {};

  let itemsProcessed = 0;
  const sharedTags = $selectedItems.ids
    .map((id) => items.find((item) => item.id === id))
    .reduce((acc, item) => {
      if (item) {
        itemsProcessed++;
        if (acc.length === 0 && itemsProcessed === 1) {
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
  };

  const addTags = async () => {
    const origtagNames = originalTagString
      .split(",")
      .map((tag) => tag.trim())
      .filter((t) => Boolean(t) && t != "&nbsp;");

    const tagNames = tagString
      .split(",")
      .map((tag) => tag.trim())
      .filter((t) => Boolean(t) && t != "&nbsp;");

    const rmvdTags = origtagNames.filter((tag) => !tagNames.includes(tag));

    await removeItemsTags($selectedItems.ids, rmvdTags);
    await addItemsTags($selectedItems.ids, tagString);
    isSaveButtonDisabled = true;
  };
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key == "s" && e.metaKey) addTags();
  }}
/>

<h1 class="mt-2 mb-4 text-3xl text-center">Edit</h1>
<div class="text-center">
  Selected <span class="font-bold">{$selectedItems.ids.length}</span> items
</div>
<TagSelectWrapper bind:tagString />

<div class="flex justify-center mt-2 gap-x-2">
  <button
    disabled={isSaveButtonDisabled}
    class="btn btn-primary"
    title="Adds tags to existing tags (cmd + s)"
    on:click={addTags}>Update tags</button
  >
  <button
    disabled={isSaveButtonDisabled}
    class="btn btn-primary"
    title="Deletes prev. existing tags"
    on:click={save}>Overwrite tags</button
  >
</div>
<div class="flex justify-center">
  <button
    class="mt-4 text-red-600 hover:text-red-800"
    on:click={async () => {
      confirmDelete($selectedItems.ids);
      $importItems = $importItems.filter(
        (item) => !$selectedItems.ids.includes(item.id)
      );
    }}>Delete</button
  >
</div>
