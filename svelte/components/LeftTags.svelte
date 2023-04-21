<script lang="ts">
  import LeftSingleTag from "./LeftSingleTag.svelte";
  import type { FilteredTag } from "../stores/stateStore";

  export let tags: FilteredTag[];
</script>

{#each tags as tag}
  <LeftSingleTag {tag} />
{/each}
