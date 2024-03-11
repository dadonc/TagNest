<script lang="ts">
  import type { SingleItem } from "../../stores/items";

  export let item: SingleItem;
  export let maxHeightStyle: string;
</script>

<div class="select-none" style={maxHeightStyle}>
  {item.audio?.duration}
  {item.name}
  type: {item.type}
</div>
