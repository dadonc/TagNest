<script lang="ts">
  import type { SingleItem } from "../../../stores/items";
  import { currView } from "../../../stores/stateStore";
  import { formatTime, getVideoResolutionDescription } from "../../../utils";

  export let item: SingleItem;
</script>

<div class="p-2 text-base rounded bg-base-200">
  <div
    class="font-bold"
    on:click={() =>
      ($currView.isVideoDetailsOpen = !$currView.isVideoDetailsOpen)}
    on:keydown={(e) => {
      if (e.key == "Enter")
        $currView.isVideoDetailsOpen = !$currView.isVideoDetailsOpen;
    }}
  >
    Video details
  </div>
  {#if $currView.isVideoDetailsOpen}
    <div class="ml-3 text-xs">
      {#if item.video && item.video.width && item.video.height}
        <div>
          Resolution: {item.video.width}x{item.video.height} ({getVideoResolutionDescription(
            item.video.width,
            item.video.height
          )})
        </div>
        <div>Aspect ratio: {item.video.aspectRatio}</div>
        <div>Bitrate: {item.video.bitrate}</div>
        <div>FPS: {item.video.fps}fps</div>
        {#if item.video.duration}
          <div>Duration: {formatTime(item.video.duration)}</div>
        {/if}
      {/if}
    </div>
  {/if}
</div>
<div class="h-2"></div>
