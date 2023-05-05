<script lang="ts">
  import { importItems } from "../../../stores/items";
  import ImportItemLine from "./ImportItemLine.svelte";
</script>

{#each $importItems as importItem}
  <ImportItemLine {importItem} />
{/each}

<div class="my-8 text-center">
  <button class="btn bg-primary">
    Import {$importItems.length} items
  </button>
</div>
