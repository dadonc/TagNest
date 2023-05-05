<script lang="ts">
  import type { SingleItem } from "../../../stores/items";
  import { selectedItems } from "../../../stores/stateStore";
  import { classNames, selectItem } from "../../../utils";
  import { importSteps } from "./importQueue";
  export let importItem: SingleItem;

  $: isItemSelected = $selectedItems.ids.includes(importItem.id);
  //@ts-ignore
  let countImportSteps = importSteps[importItem.type]
    ? //@ts-ignore
      importSteps[importItem.type].count
    : 0;

  async function selectAction(
    e: MouseEvent | KeyboardEvent,
    currentItem: SingleItem
  ) {
    const newSelection = await selectItem({
      event: e,
      currentItem,
      useImportItems: true,
    });
    if (newSelection) {
      selectedItems.set(newSelection);
    }
  }
</script>

<div
  on:keydown={(e) => {
    if (e.key === "Enter") {
      selectAction(e, importItem);
    }
  }}
  on:click={(e) => selectAction(e, importItem)}
  class={classNames(isItemSelected ? "bg-gray-200" : "")}
>
  {#if countImportSteps > 0}
    {`${importItem.importStep}/${countImportSteps}  `}
  {/if}
  {importItem.name}
</div>
