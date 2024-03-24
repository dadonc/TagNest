<script lang="ts">
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";
  import { importItems, type ImportItem } from "../../stores/items";
  import { addToDeleteQueue } from "../main/delete/DeleteQueue";
  import { importSteps } from "../main/import/importQueue";
  import LoaderCircle from "../top/LoaderCircle.svelte";

  export let importItem: ImportItem;

  const cancelImport = () => {
    addToDeleteQueue([importItem.id]);
    importItems.update((items) => {
      return items.filter((item) => item.id !== importItem.id);
    });
  };

  let displayMore = true;
  // @ts-ignore
  const importStepsObject = importSteps[importItem.type];
  console.log(importItem.type, importStepsObject);
  console.log(importItem);

  // TODO
  // this breaks with items not in importSteps, e.g. image, bookmark(?)
  // display combine behavior as step 0
  // fix isImportFinished
  // add icons

  const countSteps = Object.keys(importStepsObject).length;
</script>

<div>
  <div class="flex items-center">
    {#if importItem.importStep === -1}
      <span class=""> not yet started </span>
    {/if}
    {#if importItem.importFinished}
      <span class=""> done </span>
    {/if}
    {#if importItem.importStep !== -1 && !importItem.importFinished}
      <span class="">
        <LoaderCircle />
      </span>
    {/if}

    {importItem.importStep}/{countSteps}
    <button
      on:click={() => {
        displayMore = !displayMore;
      }}
    >
      <ChevronLeft
        className={`h-3 w-3 ${displayMore ? "-rotate-90" : "rotate-180"}`}
      />
    </button>
    {importItem.name}
    <button on:click={cancelImport}>cancel</button>
  </div>
  {#if displayMore}
    <div class="ml-4">
      {#each [...Array(countSteps + 1).keys()].slice(1) as c}
        <div>
          {#if importItem.importStep < c}
            {c}
          {/if}
          {#if importItem.importStep === c}
            <span class="font-bold"> {c} </span>
          {/if}
          {#if importItem.importStep > c}
            {c}
          {/if}
          {importStepsObject[c].desc}
        </div>
      {/each}
    </div>
  {/if}
</div>
