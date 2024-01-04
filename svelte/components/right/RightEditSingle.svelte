<script lang="ts">
  import { type SingleItem } from "../../stores/items";
  import { currentRoute } from "../../stores/stateStore";
  import { formatTime, getVideoResolutionDescription } from "../../utils";
  import ChooseVideoThumb from "../top/ChooseVideoThumb.svelte";
  import CreateOrEdit from "../top/CreateOrEdit.svelte";

  export let item: SingleItem;
  export let close: () => void = () => {};
  let isChooseVideoThumbOpen = false;
</script>

{#key item}
  {#if isChooseVideoThumbOpen}
    <h1 class="mt-2 mb-4 text-3xl text-center">Choose Thumbnail</h1>

    <ChooseVideoThumb
      {item}
      close={() => {
        isChooseVideoThumbOpen = false;
        close();
      }}
    />
  {:else}
    {#if $currentRoute === "importMultiple"}
      <h1 class="mt-2 mb-4 text-3xl text-center">Import</h1>
    {:else}
      <h1 class="mt-2 mb-4 text-3xl text-center">Edit</h1>
    {/if}

    <CreateOrEdit originalItem={item} {close} bind:isChooseVideoThumbOpen />
    {#if item.type == "video"}
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
    {/if}
  {/if}
{/key}
