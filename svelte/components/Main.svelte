<script lang="ts">
  import { items } from "../stores/items";
  import MainGrid from "./MainGrid.svelte";
</script>

{#await $items}
  <div />
{:then items}
  <MainGrid {items} />
{/await}
