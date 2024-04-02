<script lang="ts">
  import { onMount } from "svelte";
  import AlertTriangle from "../../assets/feather/AlertTriangle.svelte";
  import { allTags, deleteTagById, refreshTagsStore } from "../../stores/tags";
  import { contextMenuStore } from "../../stores/stateStore";
  import { refreshDisplayedItems } from "../../stores/items";
  export let close: () => void;

  let confirmButton: HTMLButtonElement;

  let tagName: string | undefined = undefined;
  onMount(() => {
    tagName = $allTags.find(
      (tag) => tag.id === $contextMenuStore.triggeredByTagId
    )?.name;
    confirmButton.focus();
  });

  function deleteTag() {
    deleteTagById($contextMenuStore.triggeredByTagId);
    refreshDisplayedItems();
    refreshTagsStore();
  }
</script>

<h1 class="flex items-center justify-between mt-2 mb-2 text-xl text-center">
  <AlertTriangle className="w-8 h-8 mr-6 inline-block text-red-600" />
  <div>
    <div>Delete tag?</div>

    <div class="mt-1 text-xs text-gray-500">
      This action cannot be undone.<br />The items will still be available in
      the library.
    </div>
  </div>
  <AlertTriangle className="w-8 h-8 ml-6 inline-block text-red-600" />
</h1>

<!-- <div class="mt-4 text-center">Are you sure you want to delete the tag:</div> -->
<div class="my-2 text-lg font-bold text-center">{tagName}</div>
<!-- <div class="text-center">?</div> -->

<div class="flex flex-col items-center justify-center">
  <button
    class="p-2 my-4 text-white bg-red-600 btn hover:bg-red-700"
    bind:this={confirmButton}
    on:click={() => {
      deleteTag();
      close();
    }}>Delete tag</button
  >
  <button class="rounded" on:click={close}>Cancel</button>
</div>
