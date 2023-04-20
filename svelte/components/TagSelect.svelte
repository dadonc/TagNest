<script lang="ts">
  import type { SingleItem } from "../stores/items";
  import { allTags } from "../stores/tags";

  export let item: SingleItem | null;
  export let tagString: string;
</script>

<input
  bind:value={tagString}
  type="text"
  placeholder="Tags"
  class="w-full mt-2 input input-bordered"
/>
