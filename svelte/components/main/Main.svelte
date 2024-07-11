<script lang="ts">
  import { onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";
  import {
    selectedItems,
    currentRoute,
    currView,
    contextMenuStore,
  } from "../../stores/stateStore";
  import ActionModal from "../modals/ActionModal.svelte";
  import MainContextMenu from "./MainContextMenu.svelte";
  import MainGrid from "./MainGrid.svelte";
  import MainList from "./MainList.svelte";
  import ImportScreen from "./import/ImportScreen.svelte";
  import { allTags } from "../../stores/tags";
  import { items as itemsStore } from "../../stores/items";

  onMount(() => {
    if ($itemsStore.length === 0 && $allTags.length === 0) {
      $contextMenuStore.openModal = "welcome";
    }
  });

  export let items: SingleItem[];
</script>

{#if $currentRoute === "main" || $currentRoute === "details"}
  {#if $currView.viewType === "grid"}
    <ActionModal />
    <MainContextMenu />
    <MainGrid {items} focusedItemId={$selectedItems.ids[0]} />
  {:else if $currView.viewType === "list"}
    <MainList {items} />
  {/if}
{:else if $currentRoute === "importMultiple"}
  <ImportScreen />
{/if}
