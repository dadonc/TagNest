<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { updateTextInfos, type SingleItem } from "../../stores/items";
  import { writable } from "svelte/store";

  export let item: SingleItem;
  const unsavedChanges = writable(false);

  // todo update item on mount
  // todo update item store on save
  // todo space preview
  // todo close button

  let textInputDiv: HTMLDivElement;
  let text = "";
  onMount(async () => {
    text = await window.electron.readFile(item.file!.path);
  });

  onDestroy(() => {
    if ($unsavedChanges) {
      const confirmMessage =
        "You have unsaved changes. Do you want to save them before leaving?";
      const userConfirmed = confirm(confirmMessage);

      if (userConfirmed) {
        saveChanges();
      }
    }
  });

  function saveChanges() {
    updateTextInfos(item, textInputDiv.textContent || text);
    window.electron.writeFile(
      item.file!.path,
      textInputDiv.textContent || text
    );
    // update items store

    unsavedChanges.set(false);
  }

  function checkForUnsavedChanges() {
    if (textInputDiv.textContent !== text) {
      unsavedChanges.set(true);
    } else {
      unsavedChanges.set(false);
    }
  }
</script>

<div class="relative w-full h-full">
  <div
    bind:this={textInputDiv}
    contenteditable="true"
    on:input={checkForUnsavedChanges}
    class="w-full h-full p-2 whitespace-pre-wrap focus:outline-0"
  >
    {text}
  </div>
  <div class="absolute bottom-1 right-1">
    <button class="btn btn-tertiary" on:click={close}>Cancel</button>
    <button
      disabled={!$unsavedChanges}
      class="btn btn-primary"
      on:click={saveChanges}>Save</button
    >
  </div>
</div>
