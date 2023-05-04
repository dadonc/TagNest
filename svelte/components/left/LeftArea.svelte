<script lang="ts">
  import LeftTags from "./LeftTags.svelte";
  import { filteredData } from "../../stores/stateStore";
</script>

{#await $filteredData}
  <div />
{:then filteredData}
  <LeftTags tags={filteredData.tags} />
{/await}
