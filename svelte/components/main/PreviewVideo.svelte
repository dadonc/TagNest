<script lang="ts">
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
</script>

<div class="select-none">
  {item.name}
  type: {item.type}
</div>
