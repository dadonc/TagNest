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
    <div slot="body" class="bg-base-100" style="height: calc(100vh - 4rem)">
      <DetailView {item} isSpacePreview={true} />
    </div>
  </Modal>
{/if}
