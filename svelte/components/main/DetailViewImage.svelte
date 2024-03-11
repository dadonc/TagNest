<script lang="ts">
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
</script>

<img src={`file://${item.file?.path}`} alt={item.name} class="max-h-full" />
