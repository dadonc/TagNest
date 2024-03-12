<script lang="ts">
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
  export let maxHeightStyle: string;
</script>

<div
  class="relative w-full h-full broder-2 border-neutral-300 bg-base-300"
  style={maxHeightStyle}
>
  <div class="whitespace-pre-wrap">
    {item.text?.preview}
  </div>
  <div class="m-2 font-bold text-right">
    {item.text?.words} words
  </div>
</div>
