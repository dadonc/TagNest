<script lang="ts">
  import { increaseCountOpened, type SingleItem } from "../../stores/items";
  import DetailViewPdf from "./DetailViewPDF.svelte";
  import DetailViewBookmark from "./DetailViewBookmark.svelte";
  import DetailViewVideo from "./DetailViewVideo.svelte";
  import DetailViewImage from "./DetailViewImage.svelte";
  import DetailViewAudio from "./DetailViewAudio.svelte";
  import DetailViewText from "./DetailViewText.svelte";
  import DetailViewExternal from "./DetailViewExternal.svelte";
  import { pinBarHeight } from "../../stores/pins";

  export let item: SingleItem;
  export let isSpacePreview = false;

  $: increaseCountOpened(item);
</script>

{#key item.id}
  <div
    class={`flex items-center justify-center max-h-full h-full`}
    style={`height: calc(100% - ${$pinBarHeight}px);`}
  >
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
    {:else if item.type === "text"}
      <DetailViewText {item} />
    {:else if item.type === "external"}
      <DetailViewExternal {item} />
    {:else}
      <p>Unknown type</p>
    {/if}
  </div>
{/key}
