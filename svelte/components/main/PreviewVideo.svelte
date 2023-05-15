<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { currentRoute, savePath } from "../../stores/stateStore";
  import Play from "../../assets/feather/Play.svelte";

  export let item: SingleItem;

  let videoElement: HTMLVideoElement;
  let playIconElement: HTMLSpanElement;

  let displayVideo = false;
  let videoIsLoaded = false;

  $: videoPath = `file://${$savePath}/previews/videos/${
    item.name?.split(".")[0]
  }_preview.${item.name!.split(".").pop()}`;
  $: thumbPath = `file://${$savePath}/previews/videos/${
    item.name?.split(".")[0]
  }_thumb.jpeg`;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div
  class="relative w-full h-full"
  style={$currentRoute === "details"
    ? "height: calc(var(--bottomContainer) - 1rem)"
    : ""}
  on:mouseenter={() => {
    displayVideo = true;
  }}
  on:mouseleave={() => {
    displayVideo = false;
  }}
  on:focus={() => {
    displayVideo = true;
  }}
  on:blur={() => {
    displayVideo = false;
  }}
>
  {#if !displayVideo || !videoIsLoaded}
    <img class="w-full h-full" src={thumbPath} alt="" />
  {/if}
  {#if displayVideo}
    <video
      muted
      loop
      bind:this={videoElement}
      class={`w-full h-full ${videoIsLoaded ? "" : "hidden"} `}
      src={videoPath}
      on:loadeddata={() => {
        videoIsLoaded = true;
      }}
      on:mouseenter={() => {
        if (videoElement.paused) videoElement.play();
        playIconElement.style.display = "none";
      }}
      on:mouseleave={() => {
        if (!videoElement.paused) videoElement.pause();
        playIconElement.style.display = "block";
      }}
    />
  {/if}
  <span
    bind:this={playIconElement}
    class="absolute inline-block w-8 h-8 p-2 transform -translate-x-1/2 -translate-y-1/2 rounded-sm bg-base-300 text-base-content top-1/2 left-1/2"
    ><Play className="w-4 h-4" /></span
  >
</div>
