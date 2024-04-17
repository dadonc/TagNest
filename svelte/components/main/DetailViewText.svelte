<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { updateTextInfos, type SingleItem } from "../../stores/items";
  import { writable } from "svelte/store";

  export let item: SingleItem;
  const unsavedChanges = writable(false);

  let textInputDiv: HTMLDivElement;
  let text = "";
  onMount(async () => {
    text = await window.electron.readFile(item.file!.path);
    const newPreview = text.slice(0, 1000);
    const newWordCount = Math.round(text.length / 5);
    if (
      item.text?.preview !== newPreview ||
      item.text?.words !== newWordCount
    ) {
      updateTextInfos(item, text);
    }
  });

  onDestroy(() => {
    if ($unsavedChanges) {
      const confirmMessage = "Save changes?";
      const userConfirmed = confirm(confirmMessage);

      if (userConfirmed) {
        saveChanges();
      }
    }
  });

  function saveChanges() {
    updateTextInfos(item, textInputDiv.innerText || text);
    window.electron.writeFile(item.file!.path, textInputDiv.innerText || text);
    unsavedChanges.set(false);
  }

  function resetChanges() {
    textInputDiv.innerText = text;
    unsavedChanges.set(false);
  }

  function checkForUnsavedChanges() {
    if (textInputDiv.innerText !== text) {
      unsavedChanges.set(true);
    } else {
      unsavedChanges.set(false);
    }
  }
</script>

<svelte:window
  on:keydown={(e) =>
    e.key === "s" && e.metaKey && $unsavedChanges && saveChanges()}
/>

<div class="relative w-full h-full">
  <div
    bind:this={textInputDiv}
    contenteditable="true"
    on:input={checkForUnsavedChanges}
    class="w-full h-full p-2 overflow-scroll whitespace-pre-wrap focus:outline-0"
  >
    {text}
  </div>
  {#if $unsavedChanges}
    <div class="absolute bottom-4 right-4">
      <button
        disabled={!$unsavedChanges}
        class="btn btn-tertiary"
        on:click={resetChanges}>Revert changes</button
      >
      <button
        disabled={!$unsavedChanges}
        class="btn btn-primary"
        on:click={saveChanges}>Save</button
      >
    </div>
  {/if}
</div>
