<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { settingsJson } from "../../stores/stateStore";
  export let videoPath: string;
  export let isCreateNew = false;

  let videoElement: HTMLVideoElement;
  let progressBar: HTMLProgressElement;
  let totalDurationSpan: HTMLSpanElement;
  let currentDurationSpan: HTMLSpanElement;

  const dispatch = createEventDispatcher();

  function formatTime(seconds: number) {
    const date = new Date(0);
    date.setSeconds(seconds);
    return date.toISOString().split("T")[1].split(".")[0];
  }

  function seek(e: MouseEvent) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.pageX - rect.left) / progressBar.offsetWidth;
    videoElement.currentTime = pos * videoElement.duration;
  }

  function updateVideo(e: MouseEvent) {
    const progressRect = progressBar.getBoundingClientRect();
    let actualPos = (e.pageX - progressRect.left) / progressBar.offsetWidth;
    videoElement.currentTime = actualPos * videoElement.duration;
    currentDurationSpan.textContent = formatTime(videoElement.currentTime);
  }

  let isOpen = isCreateNew;
  let videoIsLoaded = false;

  $: thumbPath = `file://${$settingsJson.savePath}/previews/videos/${
    videoPath.split("/").pop()!.split(".")[0]
  }_thumb.jpeg`;
</script>

{#if !isCreateNew && (!isOpen || !videoIsLoaded)}
  <img
    class="w-full"
    src={thumbPath}
    alt=""
    on:keydown={() => {}}
    on:click={() => (isOpen = true)}
  />
  <div class="h-4" />
{/if}
{#if isOpen}
  <div
    on:click={() => {
      isOpen = false;
      videoIsLoaded = false;
      dispatch("image-chosen");
    }}
    on:keydown={() => {}}
    class={`${videoIsLoaded ? "" : "hidden"}`}
  >
    <div class="max-h-full">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        style="max-height: calc(100% - 1rem);"
        bind:this={videoElement}
        id="previewVideo"
        poster=""
        on:loadeddata={() => {
          videoIsLoaded = true;
        }}
        on:loadedmetadata={() => {
          progressBar.max = videoElement.duration;
          currentDurationSpan.textContent = formatTime(
            videoElement.currentTime
          );
          totalDurationSpan.textContent = formatTime(videoElement.duration);
          progressBar.classList.remove("hidden");
        }}
      >
        <source src={"file://" + videoPath} />
      </video>
      <div class="relative h-4">
        <progress
          on:mouseover={updateVideo}
          on:mousemove={updateVideo}
          on:mouseleave={() => {
            dispatch("image-chosen");
          }}
          class="absolute hidden w-full h-full"
          bind:this={progressBar}
          value="0"
          max="0"
          on:click={seek}
          on:keydown={() => {}}
          on:focus={() => {}}
        />
        <span class="absolute text-xs pointer-events-none right-1">
          <span bind:this={currentDurationSpan} /> /
          <span bind:this={totalDurationSpan} />
        </span>
      </div>
    </div>
  </div>
{/if}
