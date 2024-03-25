<script lang="ts">
  import { importItems } from "../../stores/items";
  import { settingsJson } from "../../stores/stateStore";
  import ImportProgressLine from "./ImportProgressLine.svelte";
  import Modal from "./Modal.svelte";
  export let isOpen = false;

  const close = () => {
    isOpen = false;
  };
  const combineBehaviour =
    $settingsJson.combineBehavior === "copy"
      ? "Copy"
      : $settingsJson.combineBehavior === "move"
        ? "Move"
        : "";
</script>

<Modal {isOpen} {close} isFullWidth={false}>
  <div slot="body" class="px-8 py-4 rounded bg-base-100">
    <h1 class="my-2 text-3xl text-center">Importing</h1>
    {#each $importItems as importItem (importItem.id)}
      <ImportProgressLine {importItem} {combineBehaviour} />
    {/each}
    <div class="flex justify-center mt-6">
      <button class="btn btn-primary" on:click={close}>Close</button>
    </div>
  </div>
</Modal>
