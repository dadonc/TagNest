<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { formatTime } from "../../utils";
  import Audio2 from "../../assets/feather/Audio2.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;
  let audioPlayer: HTMLAudioElement;

  let durationString = item.audio?.duration
    ? formatTime(item.audio!.duration as number)
    : "";

  let isHovered = false;
  let currentTime = 0;

  const timeupdate = (e: any) => {
    currentTime = (e.target as HTMLAudioElement).currentTime;
  };

  const setCurrentTime = (e: any) => {
    e.target.currentTime = currentTime;
  };
</script>

<div
  class="w-full h-full broder-2 border-neutral-300 bg-base-300"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  on:mousedown={() => {
    if (audioPlayer.paused) audioPlayer.play();
    else audioPlayer.pause();
  }}
>
  <div
    class="relative flex flex-col items-center justify-center w-full h-full select-none"
    style={maxHeightStyle}
  >
    {#if !isHovered}
      <Audio2 className="w-8 h-8" />
    {:else}
      <audio
        bind:this={audioPlayer}
        class="w-full h-8"
        controls
        src={`file://${item.file?.path}`}
        on:timeupdate={timeupdate}
        on:canplay|once={setCurrentTime}
        {currentTime}
      ></audio>
    {/if}

    <div class="mt-2">
      {item.name}
    </div>
    <div class="h-4"></div>
    {#if !isHovered}
      <span
        class="absolute inline-block p-1 text-xs text-white rounded-sm bg-neutral durationString bottom-1 right-1"
        >{durationString}</span
      >
    {/if}
  </div>
</div>
