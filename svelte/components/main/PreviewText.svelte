<script lang="ts">
  import { updateTextInfos, type SingleItem } from "../../stores/items";
  import { currentRoute } from "../../stores/stateStore";
  import PreviewName from "./gschert/PreviewName.svelte";

  export let item: SingleItem;
  export let maxHeightStyle: string;

  let isHovered = false;

  $: update(isHovered);

  async function update(isHovered: boolean) {
    if (isHovered) {
      const t = await window.electron.readFile(item.file!.path);
      const newPreview = t.slice(0, 1000);
      const newWordCount = Math.round(t.length / 5);
      if (
        item.text?.preview !== newPreview ||
        item.text?.words !== newWordCount
      ) {
        updateTextInfos(item, t);
      }
    }
  }
</script>

<!-- aspect ratio is based on the pdf/external preview -->
<div
  class="relative flex flex-col w-full h-full bg-base-100 text-ellipsis hoverContainer"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  style={maxHeightStyle + "; aspect-ratio: 0.725"}
>
  <div
    class="h-full p-1 overflow-hidden text-xs whitespace-pre-wrap"
    style="word-break: break-all;"
  >
    {item.text?.preview}
  </div>
  <div
    class="absolute p-1 text-xs text-right text-white rounded-sm right-1 bg-neutral wordCount"
    style="bottom: 2.1rem;"
  >
    {item.text?.words} words
  </div>
  <PreviewName name={item.name || ""} hideName={false} />
</div>
