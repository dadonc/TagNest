<script lang="ts">
  import type { SingleItem } from "../stores/items";

  export let item: SingleItem;
  console.log(item);
</script>

<div>
  <img src={"file://" + item.file?.path} alt="" />
</div>
