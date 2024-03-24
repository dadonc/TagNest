<script lang="ts">
  import Check from "../../assets/feather/Check.svelte";
  import CheckCircle from "../../assets/feather/CheckCircle.svelte";
  import ChevronLeft from "../../assets/feather/ChevronLeft.svelte";
  import Circle from "../../assets/feather/Circle.svelte";
  import Trash2 from "../../assets/feather/Trash2.svelte";
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

  // TODO
  // this breaks with items not in importSteps, e.g. image, bookmark(?)
  // display combine behavior as step 0

  const countSteps = Object.keys(importStepsObject).length;
</script>

<div class="mb-2">
  <div class="flex items-center">
    {#if importItem.importStep === -1}
      <Circle className="h-3 w-3 text-gray-600" />
    {/if}
    {#if importItem.importFinished}
      <Check className="h-3 w-3 text-green-600" />
    {/if}
    {#if importItem.importStep !== -1 && !importItem.importFinished}
      <span class="">
        <LoaderCircle className="h-3 w-3 text-green-600" />
      </span>
    {/if}

    <button
      on:click={() => {
        displayMore = !displayMore;
      }}
    >
      <ChevronLeft
        className={`h-3 w-3 mx-2 ${displayMore ? "-rotate-90" : "rotate-180"}`}
      />
    </button>
    {importItem.name}
    <button on:click={cancelImport} title="Delete">
      <Trash2 className="ml-2 h-3 w-3 hover:text-red-500" />
    </button>
  </div>
  {#if displayMore}
    <div class="ml-6">
      {#each [...Array(countSteps + 1).keys()].slice(1) as c}
        <div>
          {#if importItem.importStep < c}
            <Circle className="h-2 w-2 inline-block text-gray-600" />
          {/if}
          {#if importItem.importStep === c}
            <LoaderCircle className="h-2 w-2 text-green-600" />
          {/if}
          {#if importItem.importStep > c}
            <CheckCircle className="h-2 w-2 inline-block text-green-600" />
          {/if}
          {importStepsObject[c].desc}
        </div>
      {/each}
    </div>
  {/if}
</div>
