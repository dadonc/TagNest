<script lang="ts">
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
</script>

<div class="flex items-center justify-center w-full h-full p-4">
  <figure class="w-full">
    <audio class="w-full" controls src={`file://${item.file?.path}`}></audio>
    <figcaption class="text-center">{item.name}</figcaption>
  </figure>
</div>
