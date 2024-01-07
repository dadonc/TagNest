<script lang="ts">
  import Modal from "../Modal.svelte";
  import { items, type SingleItem } from "../../stores/items";
  import { contextMenuStore, selectedItems } from "../../stores/stateStore";
  import RightEditSingle from "../right/RightEditSingle.svelte";
  import RightEditMultiple from "../right/RightEditMultiple.svelte";
  import ChooseVideoThumb from "../top/ChooseVideoThumb.svelte";
  import RegenerateVideoPreview from "../top/RegenerateVideoPreview.svelte";

  $: isOpen = $contextMenuStore.openModal !== "";
  $: isSingleItemSelected = $selectedItems.ids.length === 1;

  let item: SingleItem | undefined = undefined;
  let currentlySelectedItems: SingleItem[] = [];

  $: {
    if (isOpen && isSingleItemSelected) {
      const selectedItem = $items.find((i) => i.id === $selectedItems.ids[0]);
      item = selectedItem;
    }
  }

  $: {
    if (isOpen && $selectedItems.ids.length > 1) {
      currentlySelectedItems = $items.filter((item) => {
        return $selectedItems.ids.includes(item.id);
      });
    }
  }

  function close() {
    $contextMenuStore.openModal = "";
  }
</script>

{#if isOpen}
  <Modal
    {isOpen}
    isFullWidth={false}
    close={() => {
      $contextMenuStore.openModal = "";
    }}
  >
    <div slot="body" class="h-full p-4 rounded bg-base-100 w-96">
      {#if isSingleItemSelected && item}
        {#if $contextMenuStore.openModal === "editItem"}
          <RightEditSingle {item} {close} />
        {/if}
        {#if $contextMenuStore.openModal === "videoThumbnail" && item.type === "video" && item.file}
          <ChooseVideoThumb {close} {item} />
        {/if}
        {#if $contextMenuStore.openModal === "videoPreview" && item.type === "video" && item.file}
          <RegenerateVideoPreview {close} {item} />
        {/if}
      {/if}
      {#if !isSingleItemSelected && currentlySelectedItems}
        {#if $contextMenuStore.openModal === "editItems"}
          <RightEditMultiple
            items={currentlySelectedItems}
            modalClose={close}
          />
        {/if}
      {/if}
    </div>
  </Modal>
{/if}
