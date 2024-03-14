<script lang="ts">
  import { updateTextInfos, type SingleItem } from "../../stores/items";

  export let item: SingleItem;
  export let maxHeightStyle: string;

  let isHovered = false;

  $: update(isHovered);

  async function update(isHovered: boolean) {
    if (isHovered) {
      const t = await window.electron.readFile(item.file!.path);
      const newPreview = t.slice(0, 100);
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

<div
  class="relative w-full h-full p-1 overflow-hidden broder-2 border-base-300 bg-base-300 text-ellipsis"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  style={maxHeightStyle}
>
  <div class="max-h-full mb-8 whitespace-pre-wrap">
    {item.text?.preview}
  </div>
  <div class="absolute bottom-0 right-0 p-2 font-bold text-right bg-base-300">
    {item.text?.words} words
  </div>
</div>
