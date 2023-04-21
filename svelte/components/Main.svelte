<script lang="ts">
  import { filteredData } from "../stores/stateStore";
  import MainGrid from "./MainGrid.svelte";
</script>

{#await $filteredData}
  <div />
{:then filteredData}
  <MainGrid items={filteredData.items} />
{/await}
