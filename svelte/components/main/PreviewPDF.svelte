<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { settingsJson } from "../../stores/stateStore";
  import PreviewName from "./gschert/PreviewName.svelte";
  import PreviewTypeInfo from "./gschert/PreviewTypeInfo.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;
  export let hideName: boolean;

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
  class="h-full overflow-hidden hoverContainer"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
>
  <div
    class="relative flex items-center justify-center h-full"
    style={maxHeightStyle}
  >
    <img src={previewPath} alt="" class="max-h-full" style={maxHeightStyle} />
    {#if !hideName}
      <PreviewName name={item.name || ""} />
    {/if}
    <PreviewTypeInfo type={item.type} />
  </div>
</div>
