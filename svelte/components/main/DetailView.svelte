<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import DetailViewPdf from "./DetailViewPDF.svelte";
  import DetailViewBookmark from "./DetailViewBookmark.svelte";
  import DetailViewVideo from "./DetailViewVideo.svelte";
  import DetailViewImage from "./DetailViewImage.svelte";
  import DetailViewAudio from "./DetailViewAudio.svelte";

  export let item: SingleItem;
  export let isSpacePreview = false;
</script>

{#key item.id}
  <div class="flex items-center justify-center h-full">
    {#if item.type === "bookmark"}
      <DetailViewBookmark {item} />
    {:else if item.type === "image"}
      <DetailViewImage {item} />
    {:else if item.type === "pdf"}
      <DetailViewPdf {item} />
    {:else if item.type === "video"}
      <DetailViewVideo {item} {isSpacePreview} />
    {:else if item.type === "audio"}
      <DetailViewAudio {item} />
    {:else}
      <p>Unknown type</p>
    {/if}
  </div>
{/key}
