<script lang="ts">
  import type { Tag } from "@prisma/client";

  export let tags: Tag[];
</script>

{#each tags as tag}
  <div>{tag.name}</div>
{/each}
