<script lang="ts">
  import { onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";
  export let item: SingleItem;
  import Play from "../../assets/feather/Play.svelte";

  let videoContainer: HTMLDivElement;
  let videoElement: HTMLVideoElement;
  let videoElementHidden: HTMLVideoElement;
  let progressBar: HTMLProgressElement;
  let totalDurationSpan: HTMLSpanElement;
  let currentDurationSpan: HTMLSpanElement;
  let thumbElement: HTMLCanvasElement;
  let playIconElement: HTMLSpanElement;

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

  let thumbRatio = 0.35;
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
</script>

<svelte:window
  on:keydown={(e) => {
    if (e.key === " ") {
      play();
    } else if (e.key == "ArrowRight") {
      videoElement.currentTime += 10;
    } else if (e.key == "ArrowLeft") {
      videoElement.currentTime -= 10;
    } else if (e.key == "ArrowDown") {
      videoElement.currentTime += 60;
    } else if (e.key == "ArrowUp") {
      videoElement.currentTime -= 60;
    }
  }}
/>

<!-- svelte-ignore a11y-media-has-caption -->
<video class="hidden" bind:this={videoElementHidden}>
  <source src={"file://" + item.file?.path} />
</video>

<div
  class="flex flex-col items-center justify-center h-full"
  bind:this={videoContainer}
>
  <div class="relative max-h-full">
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      class="m-auto"
      id="videoPlayer"
      style="max-height: calc(100% - 1.5rem);"
      bind:this={videoElement}
      poster=""
      on:dblclick={handleFullscreen}
      on:click={play}
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
        progressBar.classList.remove("hidden");
      }}
    >
      <source src={"file://" + item.file?.path} />
    </video>
    <span
      bind:this={playIconElement}
      class="absolute inline-block w-8 h-8 p-2 transform -translate-x-1/2 -translate-y-1/2 rounded-sm bg-base-300 text-base-content top-1/2 left-1/2"
      ><Play className="w-4 h-4" /></span
    >
    <div class="relative h-6">
      <progress
        on:mouseover={displayThumb}
        on:mousemove={displayThumb}
        on:mouseleave={() => {
          thumbElement.style.display = "none";
        }}
        class="hidden w-full h-full"
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
      <span class="absolute pointer-events-none right-1">
        <span bind:this={currentDurationSpan} /> /
        <span bind:this={totalDurationSpan} />
      </span>
    </div>
  </div>
</div>
