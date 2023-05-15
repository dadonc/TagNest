<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { currentRoute, savePath } from "../../stores/stateStore";
  import Play from "../../assets/feather/Play.svelte";

  export let item: SingleItem;

  let videoElement: HTMLVideoElement;
  let playIconElement: HTMLSpanElement;

  $: videoPath = `file://${$savePath}/previews/videos/${
    item.name?.split(".")[0]
  }_preview.${item.name!.split(".").pop()}`;
</script>

<!-- svelte-ignore a11y-media-has-caption -->
<div
  class="relative w-full h-full"
  style={$currentRoute === "details"
    ? "height: calc(var(--bottomContainer) - 1rem)"
    : ""}
>
  <video
    muted
    loop
    bind:this={videoElement}
    class="w-full h-full"
    src={videoPath}
    on:mouseenter={() => {
      videoElement.play();
      playIconElement.style.display = "none";
    }}
    on:mouseleave={() => {
      videoElement.pause();
      playIconElement.style.display = "block";
    }}
  />
  <span
    bind:this={playIconElement}
    class="absolute inline-block w-8 h-8 p-2 transform -translate-x-1/2 -translate-y-1/2 rounded-sm bg-base-300 text-base-content top-1/2 left-1/2"
    ><Play className="w-4 h-4" /></span
  >
</div>
