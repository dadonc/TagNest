<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { settingsJson } from "../../stores/stateStore";
  import PreviewName from "./gschert/PreviewName.svelte";
  import PreviewTypeInfo from "./gschert/PreviewTypeInfo.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;

  let isHovered = false;

  $: fetchNewPreview(isHovered);

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
>
  <div
    class="relative flex flex-col items-center justify-center w-full h-full select-none"
    style={maxHeightStyle}
  >
    <img src={previewPath} alt="" style={maxHeightStyle} />

    {#if isHovered}
      <PreviewName name={item.name || ""} />
    {/if}
    <PreviewTypeInfo type={item.type} />
  </div>
</div>
