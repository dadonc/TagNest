<script lang="ts">
  import { allTags } from "../stores/tags";
</script>

{#await $allTags}
  <div>Loading...</div>
{:then tags}
  {#each tags as tag}
    <div>{tag.name}</div>
  {/each}
{/await}
