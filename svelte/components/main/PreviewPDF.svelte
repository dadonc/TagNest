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
  class="relative flex flex-col items-center w-full h-full hoverContainer"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  style={maxHeightStyle}
>
  <div class="flex items-center justify-center h-full">
    <img src={previewPath} alt="" class="max-h-full" />
  </div>
  <PreviewName name={item.name || ""} {hideName} />
  <PreviewTypeInfo type={item.type} />
</div>
