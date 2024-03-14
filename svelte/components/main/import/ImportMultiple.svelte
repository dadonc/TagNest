<script lang="ts">
  import { importItems } from "../../../stores/items";
  import ImportItemLine from "./ImportItemLine.svelte";
  import startImportTasks from "./importQueue";
  import { deselectItems, handleKeydownImportView } from "../../../utils";

  function importAll() {
    importItems.set($importItems.map((i) => ({ ...i, importStep: 0 })));
    startImportTasks();
  }
</script>

<svelte:window on:keydown={(e) => handleKeydownImportView(e, true)} />
<div
  on:click={deselectItems}
  on:keydown={deselectItems}
  style="min-height: calc(100% - var(--bottomDividerHeight));"
>
  {#each $importItems as importItem}
    <ImportItemLine {importItem} />
  {/each}

  <div class="my-8 text-center">
    <button class="btn bg-primary" on:click={importAll}>
      Import {$importItems.length} items
    </button>
  </div>
</div>
