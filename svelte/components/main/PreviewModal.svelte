<script lang="ts">
  import Modal from "../Modal.svelte";
  import { type SingleItem } from "../../stores/items";
  import DetailView from "./DetailView.svelte";
  import Plus from "../../assets/feather/Plus.svelte";
  export let isOpen = false;
  export let item: SingleItem;
</script>

{#if isOpen}
  <Modal
    {isOpen}
    close={() => {
      isOpen = false;
    }}
  >
    <div
      slot="body"
      class="relative bg-base-100"
      style="height: calc(100vh - 4rem)"
    >
      <button
        title="Close preview modal"
        on:click={() => {
          isOpen = false;
        }}
        class="absolute z-50 text-base-content right-4 top-4"
        style="-webkit-app-region: no-drag;"
      >
        <Plus className="w-6 h-6 rotate-45" />
      </button>
      <DetailView {item} isSpacePreview={true} />
    </div>
  </Modal>
{/if}
