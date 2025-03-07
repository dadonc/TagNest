<script lang="ts">
  import { settingsJson } from "../../../stores/stateStore";
  import { formatTime, saveAndUpdateNewVideoThumb } from "../../../utils";
  import { type SingleItem } from "../../../stores/items";

  export let item: SingleItem;
  export let close: () => void = () => {};

  let videoElement: HTMLVideoElement;
  let progressBar: HTMLProgressElement;
  let progressContainer: HTMLDivElement;
  let totalDurationSpan: HTMLSpanElement;
  let currentDurationSpan: HTMLSpanElement;

  const TEST_THUMB_TIMING = 50;

  let userClicked = false;

  function seek(e: MouseEvent) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.pageX - rect.left) / progressBar.offsetWidth;
    videoElement.currentTime = pos * videoElement.duration;
    progressBar.value = videoElement.currentTime;
    userClicked = !userClicked;
  }

  function addMarker() {
    const marker = document.createElement("span");
    marker.classList.add(
      "absolute",
      "inline-block",
      "w-1",
      "h-full",
      "bg-red-500",
      "left-0",
      "z-10",
      "pointer-events-none"
    );
    marker.style.left = `${(TEST_THUMB_TIMING / videoElement.duration) * 100}%`;
    progressContainer.appendChild(marker);

    videoElement.currentTime += TEST_THUMB_TIMING;
    progressBar.value = videoElement.currentTime;
    currentDurationSpan.textContent = formatTime(videoElement.currentTime);
  }

  function updateVideo(e: MouseEvent) {
    if (userClicked) return;
    const progressRect = progressBar.getBoundingClientRect();
    let actualPos = (e.pageX - progressRect.left) / progressBar.offsetWidth;
    videoElement.currentTime = actualPos * videoElement.duration;
    currentDurationSpan.textContent = formatTime(videoElement.currentTime);
    if (videoElement.currentTime !== TEST_THUMB_TIMING) {
      saveDisabled = false;
    }
  }

  async function saveNewThumb() {
    saveAndUpdateNewVideoThumb({
      item,
      videoPath,
    });
    close();
  }

  let videoIsLoaded = false;
  let saveDisabled = true;
  let videoPath = item.file!.path;
  $: thumbPath = `file://${$settingsJson.savePath}/previews/videos/${item.video?.thumbImageName}`;
</script>

<h1 class="mt-2 mb-4 text-3xl text-center">Choose Thumbnail</h1>

{#if !videoIsLoaded}
  <img class="max-w-full" src={thumbPath} alt="" on:keydown={() => {}} />
{/if}

<div class="max-w-full max-h-full">
  <!-- svelte-ignore a11y-media-has-caption -->
  <video
    bind:this={videoElement}
    class={`${videoIsLoaded ? "" : "hidden"}`}
    poster=""
    id="previewVideo"
    on:loadeddata={() => {
      videoIsLoaded = true;
    }}
    on:loadedmetadata={() => {
      progressBar.max = videoElement.duration;
      currentDurationSpan.textContent = formatTime(videoElement.currentTime);
      totalDurationSpan.textContent = formatTime(videoElement.duration);
      // addMarker();
      progressBar.classList.remove("hidden");
    }}
  >
    <source src={"file://" + videoPath} />
  </video>
  <div class="relative h-4" bind:this={progressContainer}>
    <progress
      on:mouseover={updateVideo}
      on:mousemove={updateVideo}
      class="absolute left-0 hidden w-full h-full bg-white cursor-pointer"
      bind:this={progressBar}
      value="0"
      max="0"
      on:click={seek}
      on:keydown={() => {}}
      on:focus={(e) => {}}
    />
    <span
      class="absolute z-20 font-mono text-xs text-gray-200 pointer-events-none right-1"
    >
      <span bind:this={currentDurationSpan} /> /
      <span bind:this={totalDurationSpan} />
    </span>
  </div>
</div>
<div class="flex justify-center mt-2 gap-x-2">
  <button class="btn btn-tertiary" on:click={close}>Cancel</button>
  <button
    disabled={saveDisabled}
    on:click={saveNewThumb}
    class="btn btn-primary">Save</button
  >
</div>
