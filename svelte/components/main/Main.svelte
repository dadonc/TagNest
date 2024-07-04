<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import {
    selectedItems,
    currentRoute,
    currView,
  } from "../../stores/stateStore";
  import ActionModal from "../modals/ActionModal.svelte";
  import MainContextMenu from "./MainContextMenu.svelte";
  import MainGrid from "./MainGrid.svelte";
  import MainList from "./MainList.svelte";
  import ImportScreen from "./import/ImportScreen.svelte";

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
