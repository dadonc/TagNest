<!-- This file was only used for development purposes -->

<script lang="ts">
  import { tick } from "svelte";
  import type { SingleItem } from "../../stores/items";
  import Grid from "gridjs-svelte";
  import { convertFileSize } from "../../utils";
  import { selectedItems } from "../../stores/stateStore";

  export let items: SingleItem[];
  let data: any[] = [];

  let instance: any;
  $: updateData(items);

  async function updateData(items: SingleItem[]) {
    data = items.map((item) => {
      return {
        id: item.id,
        name: item.name?.slice(0, 40),
        countOpened: item.countOpened,
        size: convertFileSize(item.file?.size || 0),
        createdAt: item.file!.created.toDateString(),
        updatedAt: item.file!.updated.toDateString(),
        type: item.type,
        url: item.url,
        note: item.note,
      };
    });

    await tick();
    // TODO: This is a workaround to force render the grid after data is updated
    setTimeout(() => {
      instance?.forceRender();
    }, 200);
  }
  // export let focusedItemId: string | undefined = undefined;
</script>

<!-- {#each items as item}
  <div>
    {item.name}
  </div>
{/each} -->

{#if data}
  <Grid
    bind:instance
    {data}
    sort={true}
    resizable={true}
    autoWidth={true}
    on:rowClick={(row) => {
      const id = row.detail[1]["_cells"][0]["data"];
      $selectedItems.ids = [id];
    }}
  />
{/if}

<style global>
  @import "/svelte/assets/deps/gridjs.css";
</style>
