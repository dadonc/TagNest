<script lang="ts">
  import type { SingleItem } from "../../../stores/items";
  import { formatTime, getVideoResolutionDescription } from "../../../utils";

  export let item: SingleItem;
</script>

<div class="p-2 text-base rounded bg-base-200">
  <div class="font-bold">Video details</div>
  <div class="ml-3">
    {#if item.video && item.video.width && item.video.height}
      <div>
        {item.video.width}x{item.video.height} ({getVideoResolutionDescription(
          item.video.width,
          item.video.height
        )}), {item.video.aspectRatio}
      </div>
      <div>{item.video.bitrate}, {item.video.fps}fps</div>
      {#if item.video.duration}
        <div>{formatTime(item.video.duration)}</div>
      {/if}
    {/if}
  </div>
</div>
<div class="h-2"></div>
