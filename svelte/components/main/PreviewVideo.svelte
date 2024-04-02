<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import {
    currView,
    currentRoute,
    selectedItems,
    settingsJson,
  } from "../../stores/stateStore";
  import { extractNameAndExtension } from "../../../src/gschert";
  import { formatTime, getVideoResolutionDescription } from "../../utils";

  export let item: SingleItem;
  export let maxHeightStyle: string;

  let videoElement: HTMLVideoElement;

  let displayVideo = false;
  let videoIsLoaded = false;

  let { name, extension } = extractNameAndExtension(item.name!);
  $: videoPath = `file://${$settingsJson.savePath}/previews/videos/${name}_preview.${extension}`;
  $: thumbPath = `file://${$settingsJson.savePath}/previews/videos/${item.video?.thumbImageName}`;

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

  // All the following code is for the seekbar hover functionality:

  let thumbElement: HTMLCanvasElement;
  let progressBar: HTMLProgressElement;
  let videoElementHidden: HTMLVideoElement;
  let hoverSeekTimeSpan: HTMLSpanElement;
  let thumbRatio = 0.35;

  function resizeThumbElement() {
    if (!videoElement) return; // on first render after changin to next video, videoElement is not yet defined
    thumbElement.width = videoElement.offsetWidth * thumbRatio;
    thumbElement.height = videoElement.offsetHeight * thumbRatio;
    thumbElement.style.bottom = `calc(-${
      videoElement.offsetHeight * thumbRatio //+ 24
    }px)`;
    thumbElement.style.bottom = "24px";
  }

  function displayThumb(e: MouseEvent) {
    if (thumbElement.width === 0) resizeThumbElement();
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

    if (videoElementHidden.duration) {
      videoElementHidden.currentTime = seek(e);
      videoElementHidden.addEventListener(
        "seeked",
        function onSeeked() {
          if (!videoElement) return; // has already unmounted
          videoElementHidden.removeEventListener("seeked", onSeeked);
          context?.drawImage(
            videoElementHidden,
            0,
            0,
            videoElement.offsetWidth * thumbRatio,
            videoElement.offsetHeight * thumbRatio
          );
        },
        { once: true }
      );

      hoverSeekTimeSpan.style.display = "inline-block";
      hoverSeekTimeSpan.textContent =
        formatTime(videoElementHidden.currentTime) + " / ";
    }
  }

  function seek(e: MouseEvent) {
    const progressRect = progressBar.getBoundingClientRect();
    let actualPos = (e.pageX - progressRect.left) / progressBar.offsetWidth;
    actualPos = actualPos < 0 ? 0 : actualPos;
    return actualPos * videoElementHidden.duration;
  }
</script>

<div
  class="relative flex items-center justify-center w-full"
  style={maxHeightStyle}
  on:mouseenter={() => {
    displayVideo = true;
    if (videoIsLoaded && videoElement.paused) {
      playPromise = videoElement.play();
    }
  }}
  on:mouseleave={async () => {
    await playPromise;
    videoElement.pause();
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
      videoIsLoaded ? "absolute" : ""
    } ${item.id}_preview`}
    style={maxHeightStyle}
    src={thumbPath}
    alt=""
  />
  <span
    class="absolute inline-block p-1 text-xs text-white rounded-sm bg-neutral resolutionString top-1 left-1"
    >{resolutionString}</span
  >
  <!-- <span
    class="absolute inline-block w-5 h-5 transform -translate-x-1/2 -translate-y-1/2 rounded-sm bg-neutral playIcon text-base-content top-1/2 left-1/2"
    ><Play className="w-4 h-4 text-white p-1" /></span
  > -->
  <span
    class="absolute bottom-0 right-0 inline-block p-1 font-mono text-xs text-white rounded-sm bg-neutral durationString"
    >{durationString}</span
  >
  {#if displayVideo}
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      class="hidden"
      bind:this={videoElementHidden}
      on:loadedmetadata={() => {
        progressBar.max = videoElement.duration;
        resizeThumbElement();
      }}
    >
      <source src={"file://" + item.file?.path} />
    </video>
    <!-- svelte-ignore a11y-media-has-caption -->
    <video
      loop
      bind:this={videoElement}
      class={`w-full max-h-full ${videoIsLoaded ? "z-10" : "hidden"} `}
      src={videoPath}
      style={maxHeightStyle}
      on:mouseenter={() => {
        if (videoElement.paused) {
          playPromise = videoElement.play();
        }
      }}
      on:canplay={() => {
        videoIsLoaded = true;
      }}
    />
    <progress
      on:mouseover={displayThumb}
      on:mousemove={displayThumb}
      on:mouseleave={(e) => {
        thumbElement.style.display = "none";
        hoverSeekTimeSpan.style.display = "none";
      }}
      on:mouseenter={() => {
        if (videoElement.paused) {
          playPromise = videoElement.play();
        }
      }}
      on:click={(e) => {
        $selectedItems.ids = [item.id];
        $currView.jumpToVideoTime = seek(e);
        $currentRoute = "details";
      }}
      class="absolute bottom-0 z-20 w-full h-6 cursor-pointer"
      bind:this={progressBar}
      value="0"
      max="0"
      on:keydown={() => {}}
      on:focus={() => {}}
    />
    <canvas
      bind:this={thumbElement}
      class="absolute bottom-0 left-0 z-20 hidden bg-transparent"
    />

    <span
      class="absolute z-20 font-mono text-xs text-white pointer-events-none bottom-1 right-1"
    >
      <span class="hidden" bind:this={hoverSeekTimeSpan}>00:00:00 / </span>
      <span>{durationString}</span>
    </span>
  {/if}
</div>
