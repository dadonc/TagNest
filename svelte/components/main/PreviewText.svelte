<script lang="ts">
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
  export let maxHeightStyle: string;
</script>

<div
  class="relative w-full h-full p-1 overflow-hidden broder-2 border-neutral-300 bg-base-300 text-ellipsis"
  style={maxHeightStyle}
>
  <div class="max-h-full mb-8 whitespace-pre-wrap">
    {item.text?.preview}
  </div>
  <div class="absolute bottom-0 right-0 p-2 font-bold text-right bg-base-300">
    {item.text?.words} words
  </div>
</div>
