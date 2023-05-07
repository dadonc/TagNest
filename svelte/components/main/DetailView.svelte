<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import DetailsViewBookmark from "./DetailsViewBookmark.svelte";

  export let item: SingleItem;
</script>

<div class="flex items-center justify-center h-full">
  {#if item.type === "bookmark"}
    <DetailsViewBookmark {item} />
  {/if}
  {#if item.type === "image"}
    <img src={`file://${item.file?.path}`} alt={item.name} class="max-h-full" />
  {/if}
</div>
