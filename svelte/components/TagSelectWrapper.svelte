<script lang="ts">
  import type { SingleItem } from "../stores/items";
  import { allTags } from "../stores/tags";
  import TagSelect from "./TagSelect.svelte";

  export let item: SingleItem | null;
  export let tagString: string;
</script>

{#await $allTags}
  <div>Loading...</div>
{:then tags}
  <TagSelect {item} {tagString} {tags} />
{/await}
