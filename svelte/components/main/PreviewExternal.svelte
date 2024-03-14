<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { settingsJson } from "../../stores/stateStore";

  export let item: SingleItem;
  export let maxHeightStyle: string;

  let isHovered = false;
  let extension = item.file?.path.split(".").pop();

  $: fetchNewPreview(isHovered);

  $: iconPath = `file://${$settingsJson.savePath}/icons/${extension}.png`;
  $: previewPath = `file://${$settingsJson.savePath}/icons/${item.file?.path.split("/").pop()}.png`;

  async function fetchNewPreview(isHovered: boolean) {
    if (isHovered) {
      await window.electron.saveFilePreview(item.file?.path || "");
      previewPath = `file://${$settingsJson.savePath}/icons/${item.file?.path.split("/").pop()}.png?${Date.now()}`;
    }
  }
</script>

<div
  class="w-full h-full overflow-hidden border-2 border-base-300"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  on:dblclick={() => {
    if (item.file?.path) window.electron.openFileInDefaultApp(item.file?.path);
  }}
>
  <div
    class="relative flex flex-col items-center justify-center w-full h-full select-none"
    style={maxHeightStyle}
  >
    <img src={previewPath} alt="" />
    {#if isHovered}
      <div class="absolute bottom-0 w-full p-2 mt-2 text-ellipsis bg-base-300">
        {item.name}
      </div>
    {/if}
    <!-- <div class="h-4"></div> -->
    <span
      class="absolute inline-block p-1 text-xs text-white rounded-sm bg-neutral durationString top-1 left-1"
      >{extension}</span
    >
  </div>
</div>
