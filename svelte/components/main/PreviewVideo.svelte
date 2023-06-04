<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { currentRoute, settingsJson } from "../../stores/stateStore";
  import Play from "../../assets/feather/Play.svelte";
  import { extractNameAndExtension } from "../../../src/gschert";

  export let item: SingleItem;

  let videoElement: HTMLVideoElement;
  let playIconElement: HTMLSpanElement;

  let displayVideo = false;
  let videoIsLoaded = false;

  let { name, extension } = extractNameAndExtension(item.name!);
  $: videoPath = `file://${$settingsJson.savePath}/previews/videos/${name}_preview.${extension}`;
  $: thumbPath = `file://${$settingsJson.savePath}/previews/videos/${name}_thumb.jpeg`;

  let playPromise: Promise<void> | undefined;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div
  class="relative flex items-center justify-center w-full h-full"
  style={$currentRoute == "details"
    ? "max-height: calc(var(--bottomContainer) - var(--bottomAreaPadding) * 2)"
    : ""}
  on:mouseenter={() => {
    displayVideo = true;
  }}
  on:mouseleave={async () => {
    await playPromise;
    displayVideo = false;
    videoIsLoaded = false;
  }}
  on:focus={() => {
    displayVideo = true;
  }}
  on:blur={async () => {
    await playPromise;
    displayVideo = false;
    videoIsLoaded = false;
  }}
>
  {#if !displayVideo || !videoIsLoaded}
    <img
      class={`w-full ${$currentRoute == "details" ? "h-full" : ""}`}
      src={thumbPath}
      alt=""
    />
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
        if (videoElement.paused) {
          playPromise = videoElement.play();
        }
        playIconElement.style.display = "none";
      }}
      on:mouseleave={async () => {
        await playPromise;
        videoElement.pause();
        playIconElement.style.display = "block";
      }}
    />
  {/if}
  <span
    bind:this={playIconElement}
    class="absolute inline-block w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 rounded-sm text-base-content top-1/2 left-1/2"
    ><Play className="w-4 h-4" /></span
  >
</div>
