<script lang="ts">
  import Modal from "./Modal.svelte";
  import { items, type SingleItem } from "../../stores/items";
  import { contextMenuStore, selectedItems } from "../../stores/stateStore";
  import RightEditSingle from "../right/RightEditSingle.svelte";
  import RightEditMultiple from "../right/RightEditMultiple.svelte";
  import ChooseVideoThumb from "./components/ChooseVideoThumb.svelte";
  import RegenerateVideoPreview from "./RegenerateVideoPreview.svelte";
  import ResetConfirmModal from "./ResetConfirmModal.svelte";
  import RenameTagModal from "../left/RenameTagModal.svelte";
  import DeleteTagModal from "../left/DeleteTagModal.svelte";
  import WelcomeModal from "./WelcomeModal.svelte";

  $: isOpen = $contextMenuStore.openModal !== "";
  $: isSingleItemSelected = $selectedItems.ids.length === 1;

  let item: SingleItem | undefined = undefined;
  let currentlySelectedItems: SingleItem[] = [];

  $: {
    if (isOpen && isSingleItemSelected) {
      item = $items.find((i) => i.id === $selectedItems.ids[0]);
    } else if (isOpen && !isSingleItemSelected) {
      item = undefined;
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
    {close}
    closeOnClickOutside={$contextMenuStore.openModal !== "welcome"}
  >
    <div slot="body" class="h-full p-4 rounded bg-base-100 w-96">
      {#if $contextMenuStore.openModal === "welcome"}
        <WelcomeModal />
      {/if}
      {#if isSingleItemSelected && item}
        {#if $contextMenuStore.openModal === "editItem"}
          <RightEditSingle {item} />
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
      {#if $contextMenuStore.openModal === "resetCounts"}
        <ResetConfirmModal
          {close}
          items={item ? [item] : currentlySelectedItems}
        />
      {/if}
      {#if $contextMenuStore.openModal === "renameTag"}
        <RenameTagModal {close} />
      {/if}
      {#if $contextMenuStore.openModal === "deleteTag"}
        <DeleteTagModal {close} />
      {/if}
    </div>
  </Modal>
{/if}
