<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { currentRoute, settingsJson } from "../../stores/stateStore";
  import Play from "../../assets/feather/Play.svelte";
  import { extractNameAndExtension } from "../../../src/gschert";
  import { formatTime, getVideoResolutionDescription } from "../../utils";

  export let item: SingleItem;

  let videoElement: HTMLVideoElement;

  let displayVideo = false;
  let videoIsLoaded = false;

  let { name, extension } = extractNameAndExtension(item.name!);
  $: videoPath = `file://${$settingsJson.savePath}/previews/videos/${name}_preview.${extension}`;
  $: thumbPath = `file://${$settingsJson.savePath}/previews/videos/${name}_thumb.jpeg`;

  let playPromise: Promise<void> | undefined;

  let durationString = item.video?.duration
    ? formatTime(item.video!.duration as number)
    : "";
  let resolutionString = item.video?.width
    ? getVideoResolutionDescription(
        item.video!.width as number,
        item.video!.height as number
      )
    : "";
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div class="flex items-center w-full h-full">
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
    <img
      class={`w-full ${$currentRoute == "details" ? "max-h-full" : ""} ${
        videoIsLoaded ? "absolute " : ""
      }`}
      src={thumbPath}
      id={`previewImage-${item.id}`}
      alt=""
    />
    {#if displayVideo}
      <video
        muted
        loop
        bind:this={videoElement}
        class={`w-full h-full ${videoIsLoaded ? "z-10" : "hidden"} `}
        src={videoPath}
        on:canplay={() => {
          videoIsLoaded = true;
        }}
        on:mouseenter={() => {
          if (videoElement.paused) {
            playPromise = videoElement.play();
          }
        }}
        on:mouseleave={async () => {
          await playPromise;
          videoElement.pause();
        }}
      />
    {/if}
    <span
      class="absolute inline-block w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-sm text-base-content top-1/2 left-1/2"
      ><Play className="w-4 h-4 text-white p-1" /></span
    >
    <span
      class="absolute inline-block p-1 text-xs text-white bg-black rounded-sm bottom-1 right-1"
      >{durationString}</span
    >

    <span
      class="absolute inline-block p-1 text-xs text-white bg-black rounded-sm top-1 left-1"
      >{resolutionString}</span
    >
  </div>
</div>
