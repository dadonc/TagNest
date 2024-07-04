<script lang="ts">
  import { onMount } from "svelte";
  import AlertTriangle from "../../assets/feather/AlertTriangle.svelte";
  import { resetCountOpened, type SingleItem } from "../../stores/items";
  import { contextMenuStore } from "../../stores/stateStore";
  import PreviewChooser from "../main/PreviewChooser.svelte";
  import Modal from "./Modal.svelte";

  export let close: () => void;
  export let items: SingleItem[];

  let confirmButton: HTMLButtonElement;

  onMount(() => {
    confirmButton.focus();
  });
</script>

<Modal
  isOpen={$contextMenuStore.openModal === "resetCounts"}
  {close}
  isFullWidth={false}
>
  <div slot="body" class="px-8 py-4 rounded bg-base-100">
    <h1 class="flex items-center justify-between mt-2 mb-2 text-xl text-center">
      <AlertTriangle className="w-8 h-8 mr-6 inline-block text-red-600" />
      <div>
        {#if items.length === 1}
          <div>Are you sure you want to reset this item?</div>
        {:else}
          <div>
            Are you sure you want to reset these <br />
            <span class="font-bold">{items.length}</span> items?
          </div>
        {/if}

        <div class="mt-1 text-xs text-gray-500">
          This action cannot be undone.
        </div>
      </div>
      <AlertTriangle className="w-8 h-8 ml-6 inline-block text-red-600" />
    </h1>
    {#if items.length > 1}
      <ul class="my-4 text-center list-disc list-inside">
        {#each items as item}
          <li>{item.name}</li>
        {/each}
      </ul>
    {:else if items.length === 1}
      <div class="flex flex-col items-center justify-center my-4">
        <PreviewChooser
          item={items[0]}
          hideName={true}
          maxHeightStyle="max-height: 8rem;"
        />
        {items[0].name}
      </div>
    {/if}
    <div class="flex flex-col items-center justify-center">
      <button class="btn" on:click={close}>Cancel</button>
      <button
        class="p-1 mt-4 text-red-600 hover:text-red-800"
        bind:this={confirmButton}
        on:click={() => {
          resetCountOpened(items.map((i) => i.id));
          close();
        }}
      >
        {items.length === 1
          ? "Reset item"
          : `Reset count of ${items.length} items`}</button
      >
    </div>
  </div>
</Modal>
