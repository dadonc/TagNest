<script lang="ts">
  import {
    type SingleItem,
    updateItem,
    refreshDisplayedItems,
  } from "../../stores/items";
  import { currentRoute } from "../../stores/stateStore";
  import CreateOrEdit from "../top/CreateOrEdit.svelte";

  export let item: SingleItem;
</script>

{#key item}
  {#if $currentRoute === "importMultiple"}
    <h1 class="mt-2 mb-4 text-3xl text-center">Import</h1>
  {:else}
    <h1 class="mt-2 mb-4 text-3xl text-center">Edit</h1>
  {/if}

  <CreateOrEdit originalItem={item} />
{/key}
