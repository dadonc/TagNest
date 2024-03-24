<script lang="ts">
  import { allTags } from "../../../stores/tags";
  import TagSelect from "./TagSelect.svelte";

  export let tagString: string;
</script>

{#await $allTags then tags}
  <TagSelect bind:tagString {tags} />
{/await}
