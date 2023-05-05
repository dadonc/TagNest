<script lang="ts">
  import { importItems } from "../../../stores/items";
  import ImportItemLine from "./ImportItemLine.svelte";
  import startImportTasks from "./importQueue";

  function importAll() {
    importItems.set($importItems.map((i) => ({ ...i, importStep: 1 })));
    startImportTasks();
  }
</script>

{#each $importItems as importItem}
  <ImportItemLine {importItem} />
{/each}

<div class="my-8 text-center">
  <button class="btn bg-primary" on:click={importAll}>
    Import {$importItems.length} items
  </button>
</div>
