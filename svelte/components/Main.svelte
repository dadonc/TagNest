<script lang="ts">
  import { getItems } from "../stores/items";
  import ItemPreview from "./ItemPreview.svelte";
  const items = getItems();
</script>

{#await items}
  <div>Loading...</div>
{:then items}
  {#each items as item}
    <ItemPreview {item} />
  {/each}
{/await}
