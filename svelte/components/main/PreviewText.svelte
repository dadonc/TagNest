<script lang="ts">
  import { updateTextInfos, type SingleItem } from "../../stores/items";
  import { currentRoute } from "../../stores/stateStore";

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

<!-- aspect ratio is based on the pdf/external preview -->
<div
  class="relative w-full h-full p-1 overflow-hidden border-2 border-base-300 bg-base-300 text-ellipsis"
  on:mouseenter={() => (isHovered = true)}
  on:mouseleave={() => (isHovered = false)}
  style={maxHeightStyle + "; aspect-ratio: 0.725"}
>
  {#if $currentRoute == "details"}
    <!-- Because the item.text is positioned absolutely this preview doesn't have any size in the BottomArea preview -->
    <div class="w-screen"></div>
  {/if}

  <div class="absolute inline-block mb-8 text-xs whitespace-pre-wrap">
    {item.text?.preview}
  </div>
  <div
    class="absolute p-1 text-xs text-right text-white rounded-sm bottom-1 right-1 bg-neutral"
  >
    {item.text?.words} words
  </div>
</div>
