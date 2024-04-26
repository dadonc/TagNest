<script lang="ts">
  import { extractNameAndExtension } from "../../../src/gschert";
  import { increaseCountOpened, type SingleItem } from "../../stores/items";
  import { settingsJson } from "../../stores/stateStore";
  import PreviewName from "./gschert/PreviewName.svelte";
  import PreviewTypeInfo from "./gschert/PreviewTypeInfo.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;
  export let hideName: boolean;

  let isHovered = false;
  const { name, extension } = extractNameAndExtension(item.file?.path || "");
  $: fetchNewPreview(isHovered);

  // $: iconPath = `file://${$settingsJson.savePath}/icons/${extension}.png`;
  $: previewPath = `file://${$settingsJson.savePath}/icons/${item.file?.path.split("/").pop()}.png`;

  async function fetchNewPreview(isHovered: boolean) {
    if (isHovered) {
      await window.electron.saveFilePreview(item.file?.path || "");
      await window.electron.updateItemsBasedOnFiles([item.id]);
      previewPath = `file://${$settingsJson.savePath}/icons/${item.file?.path.split("/").pop()}.png?${Date.now()}`;
    }
  }
</script>

<div
  class="relative flex flex-col items-center w-full h-full overflow-hidden hoverContainer"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  on:dblclick={() => {
    if (item.file?.path) {
      document.body.classList.add("loading");
      setTimeout(() => {
        document.body.classList.remove("loading");
      }, 200);
      increaseCountOpened(item);
      window.electron.openFileInDefaultApp(item.file.path);
    }
  }}
>
  <div class="flex items-center justify-center h-full">
    <img src={previewPath} alt="" class="max-h-full" style={maxHeightStyle} />
  </div>
  <PreviewTypeInfo type={extension} />
  <PreviewName name={name + "." + extension} {hideName} />
</div>
