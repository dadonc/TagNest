<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import {
    currView,
    currentRoute,
    selectedItems,
    settingsJson,
  } from "../../stores/stateStore";
  import { extractNameAndExtension } from "../../../src/gschert";
  import {
    classNames,
    formatTime,
    getVideoResolutionDescription,
  } from "../../utils";
  import PreviewName from "./gschert/PreviewName.svelte";

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
  let thumbRatio = 0.75;

  function resizeThumbElement() {
    if (!videoElement) return; // on first render after changin to next video, videoElement is not yet defined
    thumbElement.width = videoElement.offsetWidth * thumbRatio;
    thumbElement.height = videoElement.offsetHeight * thumbRatio;
    thumbElement.style.bottom = `calc(-${
      videoElement.offsetHeight * thumbRatio //+ 24
    }px)`;
    thumbElement.style.bottom = "28px";
  }

  function displayThumb(e: MouseEvent, markPos?: number) {
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
      if (markPos) {
        videoElementHidden.currentTime = markPos;
      } else {
        videoElementHidden.currentTime = seek(e);
      }
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

  function getMarkLeftOffset(markTime: number) {
    const progressRect = progressBar.getBoundingClientRect();
    const percentage = markTime / videoElementHidden.duration;
    return percentage * progressRect.width;
  }
</script>

<div
  class="relative w-full"
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
      videoIsLoaded ? "hidden" : ""
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
    class={classNames(
      "absolute inline-block p-1 font-mono text-xs text-white rounded-sm right-1 bottom-8 bg-neutral durationString",
      displayVideo ? "hidden" : ""
    )}>{durationString}</span
  >
  {#if !displayVideo}
    <PreviewName name={item.name || ""} hideName={false} />
  {/if}

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
      title={item.name}
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
    <div class="w-full bg-red-500 h-7"></div>
    <progress
      title={item.name}
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
        const video = document.getElementById("videoPlayer");
        if (video) {
          // jump to position in video from bottomarea in detail view
          // @ts-ignore
          video.currentTime = seek(e);
        } else {
          $selectedItems.ids = [item.id];
          $currView.jumpToVideoTime = seek(e);
          $currentRoute = "details";
        }
      }}
      class="absolute bottom-0 z-20 w-full cursor-pointer h-7"
      bind:this={progressBar}
      value="0"
      max="0"
      on:keydown={() => {}}
      on:focus={() => {}}
    />
    {#if videoIsLoaded && videoElementHidden.duration > 0}
      {#each item.video?.marks || [] as mark}
        <button
          on:mouseover={(e) => displayThumb(e, mark.mark)}
          on:mousemove={(e) => displayThumb(e, mark.mark)}
          on:mouseleave={() => {
            thumbElement.style.display = "none";
          }}
          on:focus={() => {}}
          on:click={(e) => {
            const video = document.getElementById("videoPlayer");
            if (video) {
              // @ts-ignore
              // jump to position in video from bottomarea in detail view
              video.currentTime = mark.mark;
            } else {
              $selectedItems.ids = [item.id];
              $currView.jumpToVideoTime = mark.mark;
              $currentRoute = "details";
            }
          }}
          class="absolute bottom-0 z-40 w-2 bg-red-500 h-7 hover:bg-yellow-400 focus:outline-none"
          style={`left: ${getMarkLeftOffset(mark.mark)}px`}
        >
        </button>
      {/each}
    {/if}

    <canvas
      bind:this={thumbElement}
      class="absolute bottom-0 left-0 z-20 hidden bg-transparent"
    />

    <span
      class="absolute bottom-0 z-40 font-mono text-xs leading-7 text-white pointer-events-none h-7 right-2"
    >
      <span class="hidden" bind:this={hoverSeekTimeSpan}>00:00:00 / </span>
      <span>{durationString}</span>
    </span>
  {/if}
</div>
