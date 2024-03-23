<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import Grid from "gridjs-svelte";

  export let items: SingleItem[];

  $: data = items.map((item) => {
    return {
      id: item.id,
      name: item.name,
      createdAt: item.createdAt.toDateString(),
      updatedAt: item.updatedAt.toDateString(),
      type: item.type,
      url: item.url,
      note: item.note,
    };
  });
  export let focusedItemId: string | undefined = undefined;
</script>

<!-- {#each items as item}
  <div>
    {item.name}
  </div>
{/each} -->

{#if data}
  <Grid
    {data}
    sort={true}
    resizable={true}
    on:rowClick={(row) => {
      console.log(row);
      console.log(JSON.stringify(row));
      // $selectedItems.ids = [row.cells[0].data];
    }}
  />
{/if}

<style global>
  @import "/svelte/assets/deps/gridjs.css";
</style>
