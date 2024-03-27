<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import PreviewAudio from "./PreviewAudio.svelte";
  import BookmarkPreview from "./PreviewBookmark.svelte";
  import ImagePreview from "./PreviewImage.svelte";
  import PreviewPdf from "./PreviewPDF.svelte";
  import PreviewText from "./PreviewText.svelte";
  import PreviewVideo from "./PreviewVideo.svelte";
  import PreviewExternal from "./PreviewExternal.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string = "";
  export let hideName: boolean = false;
</script>

{#if item.type === "image"}
  <ImagePreview {item} {maxHeightStyle} />
{:else if item.type === "bookmark"}
  <BookmarkPreview {item} {maxHeightStyle} />
{:else if item.type === "pdf"}
  <PreviewPdf {item} {maxHeightStyle} {hideName} />
{:else if item.type === "video"}
  <PreviewVideo {item} {maxHeightStyle} />
{:else if item.type === "audio"}
  <PreviewAudio {item} {maxHeightStyle} />
{:else if item.type === "text"}
  <PreviewText {item} {maxHeightStyle} />
{:else if item.type === "external"}
  <PreviewExternal {item} {maxHeightStyle} {hideName} />
{:else}
  <div class="flex flex-col items-center justify-center h-full bg-base-300">
    <div class="text-sm text-gray-500">Unknown file type</div>
    <div class="text-sm text-gray-500">{item.name}</div>
  </div>
{/if}
