<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import DetailViewPdf from "./DetailViewPDF.svelte";
  import DetailViewBookmark from "./DetailViewBookmark.svelte";

  export let item: SingleItem;
</script>

<div class="flex items-center justify-center h-full">
  {#if item.type === "bookmark"}
    <DetailViewBookmark {item} />
  {:else if item.type === "image"}
    <img src={`file://${item.file?.path}`} alt={item.name} class="max-h-full" />
  {:else if item.type === "pdf"}
    <DetailViewPdf {item} />
  {/if}
</div>
