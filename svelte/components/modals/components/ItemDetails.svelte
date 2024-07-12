<script lang="ts">
  import type { SingleItem } from "../../../stores/items";
  import { contextMenuStore, currView } from "../../../stores/stateStore";
  import { convertFileSize, formatDate } from "../../../utils";

  export let item: SingleItem;
</script>

<div class="p-2 text-base rounded bg-base-200">
  <div
    class="font-bold"
    on:click={() =>
      ($currView.isItemDetailsOpen = !$currView.isItemDetailsOpen)}
    on:keydown={(e) => {
      if (e.key == "Enter")
        $currView.isItemDetailsOpen = !$currView.isItemDetailsOpen;
    }}
  >
    Item details
  </div>
  {#if $currView.isItemDetailsOpen}
    <div class="ml-3 text-xs">
      <div class="flex justify-between">
        <span>Count opened: {item.countOpened}</span>
        <button
          class="btn btn-xs"
          on:click={() => {
            $contextMenuStore.openModal = "resetCounts";
          }}>reset</button
        >
      </div>
      {#if item.file}
        <div>Size: {convertFileSize(item.file.size)}</div>
      {/if}
      <div>Date created: {formatDate(item.createdAt)}</div>
      <div>Date updated: {formatDate(item.updatedAt)}</div>
    </div>
  {/if}
</div>
<div class="h-2"></div>
