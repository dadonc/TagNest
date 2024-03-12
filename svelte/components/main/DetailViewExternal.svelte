<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import { settingsJson } from "../../stores/stateStore";
  export let item: SingleItem;

  $: previewPath = `file://${$settingsJson.savePath}/icons/${item.file?.path.split("/").pop()}.png`;
</script>

<div class="justify-center h-full">
  <img
    src={previewPath}
    alt={item.name}
    class="m-auto"
    style="height: calc(100% - 6rem)"
  />
  <div class="flex flex-col items-center justify-center">
    <span class="my-2 italic font-bold">{item.name}</span>
    <button
      class="mb-2 btn btn-primary"
      on:click={() => {
        window.electron.openFileInDefaultApp(item.file?.path ?? "");
      }}>Open in default application</button
    >
  </div>
</div>
