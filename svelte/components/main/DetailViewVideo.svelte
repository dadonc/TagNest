<script lang="ts">
  import { onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";
  import Play from "../../assets/feather/Play.svelte";
  import { formatTime, toggleFakeFullscreen } from "../../utils";
  import { extractNameAndExtension } from "../../../src/gschert";
  import { settingsJson } from "../../stores/stateStore";
  import Maximize from "../../assets/feather/Maximize.svelte";

  export let item: SingleItem;
  export let isSpacePreview = false;

  let videoContainer: HTMLDivElement;
  let videoElement: HTMLVideoElement;
  let videoElementHidden: HTMLVideoElement;
  let progressBar: HTMLProgressElement;
  let totalDurationSpan: HTMLSpanElement;
  let currentDurationSpan: HTMLSpanElement;
  let thumbElement: HTMLCanvasElement;
  let playIconElement: HTMLSpanElement;
  let maximizeIconElement: HTMLSpanElement;

  onMount(() => {
    const resizeObserver = new ResizeObserver(resizeThumbElement);
    resizeObserver.observe(videoElement);
    () => {
      resizeObserver.disconnect();
    };
  });

  function resizeThumbElement() {
    if (!videoElement) return; // on first render after changin to next video, videoElement is not yet defined
    thumbElement.width = videoElement.offsetWidth * thumbRatio;
    thumbElement.height = videoElement.offsetHeight * thumbRatio;
    thumbElement.style.top = `calc(-${
      videoElement.offsetHeight * thumbRatio
    }px)`;
  }

  let thumbRatio = 0.2;
  function play() {
    if (videoElement.paused || videoElement.ended) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }

  function timeUpdate() {
    progressBar.value = videoElement.currentTime;
    currentDurationSpan.textContent = formatTime(videoElement.currentTime);
  }

  function seek(e: MouseEvent) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.pageX - rect.left) / progressBar.offsetWidth;
    videoElement.currentTime = pos * videoElement.duration;
  }

  function handleFullscreen() {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
  }

  function displayThumb(e: MouseEvent) {
    const progressRect = progressBar.getBoundingClientRect();
    let renderPos =
      (e.pageX - progressRect.left - thumbElement.offsetWidth / 2) /
      progressBar.offsetWidth;
    renderPos =
      renderPos < 0
        ? 0
        : renderPos > 1 - thumbRatio
          ? 1 - thumbRatio
          : renderPos;
    thumbElement.style.left = `${renderPos * 100}%`;
    thumbElement.style.display = "block";

    const context = thumbElement.getContext("2d");
    let actualPos = (e.pageX - progressRect.left) / progressBar.offsetWidth;
    actualPos = actualPos < 0 ? 0 : actualPos;
    videoElementHidden.currentTime = actualPos * videoElement.duration;
    context?.drawImage(
      videoElementHidden,
      0,
      0,
      videoElement.offsetWidth * thumbRatio,
      videoElement.offsetHeight * thumbRatio
    );
  }

  let videoIsLoaded = false;
  let wasPreviewHidden = false;
  $: showActionElements =
    !isSpacePreview || (isSpacePreview && wasPreviewHidden);
  let { name, extension } = extractNameAndExtension(item.name!);
  $: thumbPath = `file://${$settingsJson.savePath}/previews/videos/${name}_thumb.jpeg`;
  $: previewPath = `file://${$settingsJson.savePath}/previews/videos/${name}_preview.${extension}`;
</script>

<svelte:window
  on:keydown={(e) => {
    e.preventDefault();
    if (e.key === " ") {
      wasPreviewHidden = true;
      play();
    } else if (e.key == "ArrowRight") {
      videoElement.currentTime += 10;
    } else if (e.key == "ArrowLeft") {
      videoElement.currentTime -= 10;
    } else if (e.key == "ArrowDown") {
      if (e.altKey) {
        videoElement.currentTime -= 300; // 5 minutes
        return;
      }
      videoElement.currentTime -= 60;
    } else if (e.key == "ArrowUp") {
      if (e.altKey) {
        videoElement.currentTime += 300; // 5 minutes
        return;
      }
      videoElement.currentTime += 60;
    } else if (e.key == "f") {
      handleFullscreen();
    }
  }}
  on:fullscreenchange={() => {
    if (document.fullscreenElement === null) {
      maximizeIconElement.classList.remove("hidden");
      videoContainer.classList.add("flex");
    } else {
      maximizeIconElement.classList.add("hidden");
      videoContainer.classList.remove("flex");
    }
  }}
/>

<video class="hidden" bind:this={videoElementHidden}>
  <source src={"file://" + item.file?.path} />
</video>

<div class="flex items-center w-full h-full" bind:this={videoContainer}>
  <div class="relative flex flex-col justify-center h-full max-w-full m-auto">
    {#if isSpacePreview && !wasPreviewHidden}
      <video
        autoplay
        loop
        on:click={() => {
          wasPreviewHidden = true;
          play();
        }}
        poster={thumbPath}
        class={`max-w-full max-h-full`}
        src={previewPath}
      />
    {/if}
    {#if !isSpacePreview && !videoIsLoaded}
      <img style={"max-height: calc(100% - 1rem);"} src={thumbPath} alt="" />
    {/if}
    <video
      id="videoPlayer"
      style={isSpacePreview
        ? "max-w-full max-h-full"
        : "max-height: calc(100% - 1rem);"}
      class={(!isSpacePreview && videoIsLoaded) ||
      (isSpacePreview && wasPreviewHidden)
        ? ""
        : "hidden"}
      bind:this={videoElement}
      poster={thumbPath}
      on:dblclick={toggleFakeFullscreen}
      on:click={play}
      on:canplay={() => {
        videoIsLoaded = true;
      }}
      on:play={() => {
        playIconElement.style.display = "none";
      }}
      on:pause={() => {
        playIconElement.style.display = "block";
      }}
      on:timeupdate={timeUpdate}
      on:loadedmetadata={() => {
        progressBar.max = videoElement.duration;
        currentDurationSpan.textContent = formatTime(videoElement.currentTime);
        totalDurationSpan.textContent = formatTime(videoElement.duration);
        resizeThumbElement();
      }}
    >
      <source src={"file://" + item.file?.path} />
    </video>
    <span
      bind:this={playIconElement}
      class="absolute flex items-center justify-center w-8 h-8 p-2 transform -translate-x-1/2 -translate-y-1/2 rounded-sm bg-base-300 text-base-content top-1/2 left-1/2"
      ><Play className="w-4 h-4" /></span
    >
    <button
      on:click={() => videoContainer.requestFullscreen()}
      bind:this={maximizeIconElement}
      class={showActionElements
        ? "absolute flex items-center justify-center w-6 h-6 p-0 rounded-sm cursor-pointer bg-base-300 text-base-content hover:bg-base-content hover:text-base-300 top-2 right-2"
        : "hidden"}><Maximize className="w-4 h-4" /></button
    >
    <div class={showActionElements ? "relative h-4" : "opacity-0 h-4"}>
      <progress
        on:mouseover={displayThumb}
        on:mousemove={displayThumb}
        on:mouseleave={() => {
          thumbElement.style.display = "none";
        }}
        class="absolute w-full h-4"
        bind:this={progressBar}
        value="0"
        max="0"
        on:click={seek}
        on:keydown={() => {}}
        on:focus={() => {}}
      />
      <canvas
        bind:this={thumbElement}
        class="absolute top-0 left-0 z-50 hidden bg-transparent"
      />
      <span
        class="absolute font-mono text-xs text-gray-200 pointer-events-none right-1"
      >
        <span bind:this={currentDurationSpan}>00:00:00</span> /
        <span bind:this={totalDurationSpan}>00:00:00</span>
      </span>
    </div>
  </div>
</div>
