<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { settingsJson } from "../../stores/stateStore";

  $: previewPath = `file://${$settingsJson.savePath}/icons/${item.file?.path.split("/").pop()}.png`;
  export let item: SingleItem;
</script>

<img src={previewPath} alt={item.name} class="max-h-full" />
