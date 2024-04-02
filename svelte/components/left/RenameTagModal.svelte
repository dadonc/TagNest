<script lang="ts">
  import { onMount } from "svelte";
  import { contextMenuStore } from "../../stores/stateStore";
  import { allTags, renameTag } from "../../stores/tags";

  export let close: () => void;

  let nameInput: HTMLInputElement | null = null;

  let tagName: string | undefined = undefined;
  let newName = "";
  onMount(() => {
    nameInput?.focus();
    tagName = $allTags.find(
      (tag) => tag.id === $contextMenuStore.triggeredByTagId
    )?.name;
  });

  $: disabled = !newName || newName === tagName;

  function rename() {
    if (!newName) return;
    renameTag($contextMenuStore.triggeredByTagId, newName);
    close();
  }
</script>

<h1 class="mt-2 mb-2 text-2xl text-center">Rename tag</h1>

<div>Old name: <span class="font-bold">{tagName}</span></div>
<input
  bind:this={nameInput}
  type="text"
  class="w-full my-4 input"
  bind:value={newName}
  placeholder="New name"
/>
<div class="flex items-center justify-center">
  <button class="" on:click={close}>Cancel</button>
  <button class="ml-4 btn" {disabled} on:click={rename}>Rename</button>
</div>
