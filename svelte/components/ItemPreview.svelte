<script lang="ts">
  import type { SingleItem } from "../stores/items";

  export let item: SingleItem;
</script>

<div>
  <img src={"file://" + item.file?.path} alt="" />
</div>
