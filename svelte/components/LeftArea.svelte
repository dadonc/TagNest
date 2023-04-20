<script lang="ts">
  import { allTags } from "../stores/tags";
  import LeftTags from "./LeftTags.svelte";
</script>

{#await $allTags}
  <div />
{:then tags}
  <LeftTags {tags} />
{/await}
