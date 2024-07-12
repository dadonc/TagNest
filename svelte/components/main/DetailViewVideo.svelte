<script lang="ts">
  import { onMount } from "svelte";
  import { refreshDisplayedItems, type SingleItem } from "../../stores/items";
  import Play from "../../assets/feather/Play.svelte";
  import {
    formatTime,
    openContextMenu,
    toggleFakeFullscreen,
  } from "../../utils";
  import { extractNameAndExtension } from "../../../src/gschert";
  import {
    contextMenuStore,
    currView,
    settingsJson,
  } from "../../stores/stateStore";
  import Maximize from "../../assets/feather/Maximize.svelte";
  import DetailViewVideoContextMenu from "./DetailViewVideoContextMenu.svelte";
  import { addVideoMark, deleteMark } from "./DetailViewVideoHelper";

  export let item: SingleItem;
  export let isSpacePreview = false;

  let videoContainer: HTMLDivElement;
  let videoElement: HTMLVideoElement;
  let videoElementHidden: HTMLVideoElement;
  let progressBar: HTMLProgressElement;
  let totalDurationSpan: HTMLSpanElement;
  let currentDurationSpan: HTMLSpanElement;
  let thumbElement: HTMLCanvasElement;
  let thumbTimeElement: HTMLSpanElement;
  let playIconElement: HTMLSpanElement;
  let maximizeIconElement: HTMLSpanElement;

  let directJumpToTime = 0;
  onMount(() => {
    directJumpToTime = $currView.jumpToVideoTime || 0;
    $currView.jumpToVideoTime = 0;
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
      videoElement.offsetHeight * thumbRatio + 24
    }px)`;
  }

  let thumbRatio = 0.2;
  function togglePlay() {
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

  function getSeekPos(e: MouseEvent) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.pageX - rect.left) / progressBar.offsetWidth;
    return pos * videoElement.duration;
  }

  function seek(e: MouseEvent) {
    videoElement.currentTime = getSeekPos(e);
  }

  function getMarkLeftOffset(pos: number) {
    return (pos / videoElement.duration) * progressBar.offsetWidth;
  }

  function handleFullscreen() {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
    } else {
      videoContainer.requestFullscreen();
    }
  }

  function displayThumb(e: MouseEvent, markPos?: number) {
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
    // if hovered over a mark only display first frame of mark, else display frame at current hover position
    if (markPos) {
      videoElementHidden.currentTime = markPos;
    } else {
      let actualPos = (e.pageX - progressRect.left) / progressBar.offsetWidth;
      actualPos = actualPos < 0 ? 0 : actualPos;
      videoElementHidden.currentTime = actualPos * videoElement.duration;
    }
    context?.drawImage(
      videoElementHidden,
      0,
      0,
      videoElement.offsetWidth * thumbRatio,
      videoElement.offsetHeight * thumbRatio
    );

    thumbTimeElement.style.display = "block";
    thumbTimeElement.style.backgroundColor = "rgba(0,0,0,0.65)";
    thumbTimeElement.textContent = formatTime(videoElementHidden.currentTime);
    thumbTimeElement.style.left = `calc(${renderPos * 100}% + ${(videoElement.offsetWidth * thumbRatio) / 2}px - ${thumbTimeElement.offsetWidth / 2}px)`; // center the time element
    thumbTimeElement.style.top = `-24px`;
  }

  function openVideoSeekbarContextMenu(e: MouseEvent) {
    $contextMenuStore.videoSeekPos = getSeekPos(e);
    openContextMenu(e, "videoSeekbar");
  }

  function openVideoMarkContextMenu(e: MouseEvent, markId: string) {
    $contextMenuStore.triggeredByMarkId = markId;
    openContextMenu(e, "videoMark");
  }

  let videoIsLoaded = false;
  let wasPreviewHidden = false;
  $: showActionElements =
    !isSpacePreview || (isSpacePreview && wasPreviewHidden);
  let { name, extension } = extractNameAndExtension(item.file!.path);
  $: thumbPath = `file://${$settingsJson.savePath}/previews/videos/${item.video?.thumbImageName}`;
  $: previewPath = `file://${$settingsJson.savePath}/previews/videos/${name}_preview.${extension}`;
</script>

<svelte:window
  on:keydown={async (e) => {
    if (e.key === " ") {
      e.preventDefault();
      wasPreviewHidden = true;
      togglePlay();
    } else if (e.key == "ArrowRight") {
      if (e.metaKey) {
        const marks = (item.video?.marks || []).sort((a, b) =>
          b.mark < a.mark ? 1 : -1
        );
        const nextMark = marks.find(
          (mark) => mark.mark > videoElement.currentTime
        );
        if (nextMark) {
          videoElement.currentTime = nextMark.mark;
        } else if (marks.length > 0) {
          videoElement.currentTime = marks[0].mark;
        }
      } else {
        videoElement.currentTime += 10;
      }
    } else if (e.key == "ArrowLeft") {
      if (e.metaKey) {
        const marks = (item.video?.marks || []).sort((a, b) =>
          b.mark > a.mark ? 1 : -1
        );
        const prevMark = marks.filter(
          (mark) => mark.mark + 2 < videoElement.currentTime
        )[0];
        if (prevMark) {
          videoElement.currentTime = prevMark.mark;
        } else {
          videoElement.currentTime = 0;
        }
      } else {
        videoElement.currentTime -= 10;
      }
    } else if (e.key == "ArrowDown") {
      if (e.metaKey) {
        videoElement.currentTime -= 300; // 5 minutes
        return;
      }
      videoElement.currentTime -= 60;
    } else if (e.key == "ArrowUp") {
      if (e.metaKey) {
        videoElement.currentTime += 300; // 5 minutes
        return;
      }
      videoElement.currentTime += 60;
    } else if (e.key == "f") {
      // if (e.shiftKey) {
      //   toggleFakeFullscreen();
      // } else {
      if (document.activeElement?.id !== "searchInput") {
        handleFullscreen();
      }
      // }
    } else if (e.key == "d" && e.metaKey) {
      if (item.video) {
        // todo check that no mark already exists at that time
        const existingMark = (item.video?.marks || []).filter(
          (mark) =>
            mark.mark + 5 > videoElement.currentTime &&
            mark.mark - 5 < videoElement.currentTime
        )[0];
        if (!existingMark) {
          await addVideoMark(item.video.id, videoElement.currentTime);
          refreshDisplayedItems("added video mark");
        } else {
          console.log("mark already exists at that time");
        }
      }
    } else if (e.key == "x" && e.metaKey) {
      if (item.video) {
        const existingMark = (item.video?.marks || []).filter(
          (mark) =>
            mark.mark + 5 > videoElement.currentTime &&
            mark.mark - 5 < videoElement.currentTime
        )[0];
        if (existingMark) {
          await deleteMark(existingMark.id);
          refreshDisplayedItems("deleted video mark");
        }
      }
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

<DetailViewVideoContextMenu {item} />
<!-- svelte-ignore a11y-media-has-caption -->
<video class="hidden" bind:this={videoElementHidden}>
  <source src={"file://" + item.file?.path} />
</video>

<div class="flex items-center w-full h-full" bind:this={videoContainer}>
  <div class="relative flex flex-col justify-center h-full max-w-full m-auto">
    {#if isSpacePreview && !wasPreviewHidden}
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        autoplay
        loop
        on:click={() => {
          wasPreviewHidden = true;
          togglePlay();
        }}
        poster={thumbPath}
        class={`max-w-full max-h-full`}
        src={previewPath}
      />
    {/if}
    {#if !isSpacePreview && !videoIsLoaded}
      <img style={"max-height: calc(100% - 1rem);"} src={thumbPath} alt="" />
    {/if}
    <!-- svelte-ignore a11y-media-has-caption -->
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
      on:dblclick={() => videoContainer.requestFullscreen()}
      on:click={togglePlay}
      on:canplay={() => {
        videoIsLoaded = true;
        if (directJumpToTime) {
          videoElement.currentTime = directJumpToTime;
          directJumpToTime = 0;
          videoElement.play();
        }
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
    <button
      on:click={() => {
        wasPreviewHidden = true;
        togglePlay();
      }}
      bind:this={playIconElement}
      class="absolute flex items-center w-20 h-20 p-2 transform -translate-x-1/2 -translate-y-1/2 rounded focus:outline-none bg-base-300 text-base-content top-1/2 left-1/2"
      ><Play className="w-20 h-20" /></button
    >
    {#if !isSpacePreview}
      <button
        on:click={() => videoContainer.requestFullscreen()}
        bind:this={maximizeIconElement}
        class={showActionElements
          ? "absolute flex items-center justify-center w-6 h-6 p-0 rounded-sm cursor-pointer bg-base-300 text-base-content hover:bg-base-content hover:text-base-300 top-2 right-2"
          : "hidden"}><Maximize className="w-4 h-4" /></button
      >
    {/if}
    <div class={showActionElements ? "relative h-4" : "opacity-0 h-4"}>
      <progress
        on:mouseover={displayThumb}
        on:mousemove={displayThumb}
        on:mouseleave={() => {
          thumbElement.style.display = "none";
          thumbTimeElement.style.display = "none";
        }}
        class="absolute w-full h-4 cursor-pointer"
        bind:this={progressBar}
        value="0"
        max="0"
        on:click={seek}
        on:keydown={() => {}}
        on:focus={() => {}}
        on:contextmenu={openVideoSeekbarContextMenu}
      />
      {#if videoIsLoaded}
        {#each item.video?.marks || [] as mark}
          <button
            on:mouseover={(e) => displayThumb(e, mark.mark)}
            on:mousemove={(e) => displayThumb(e, mark.mark)}
            on:mouseleave={() => {
              thumbElement.style.display = "none";
              thumbTimeElement.style.display = "none";
            }}
            on:focus={() => {}}
            on:click={(e) => {
              videoElement.currentTime = mark.mark;
              if (videoElement.paused || videoElement.ended) {
                videoElement.play();
              }
            }}
            on:contextmenu={(e) => {
              openVideoMarkContextMenu(e, mark.id);
            }}
            class="absolute w-4 h-full bg-red-500 hover:bg-yellow-400 focus:outline-none"
            style={`left: ${getMarkLeftOffset(mark.mark)}px`}
          >
          </button>
        {/each}
      {/if}
      <canvas
        bind:this={thumbElement}
        class="absolute top-0 left-0 z-50 hidden bg-transparent"
      />
      <span
        bind:this={thumbTimeElement}
        class="absolute top-0 left-0 z-50 hidden p-1 font-mono text-xs text-gray-200 bg-base-100"
      >
      </span>
      <span
        class="absolute font-mono text-xs text-gray-200 pointer-events-none right-1"
      >
        <span bind:this={currentDurationSpan}>00:00:00</span> /
        <span bind:this={totalDurationSpan}>00:00:00</span>
      </span>
    </div>
  </div>
</div>
