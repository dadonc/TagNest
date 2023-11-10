<script lang="ts">
  import Modal from "../Modal.svelte";
  import { type SingleItem } from "../../stores/items";
  import DetailView from "./DetailView.svelte";
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
    <div slot="body" class="h-full">
      <DetailView {item} />
    </div>
  </Modal>
{/if}
