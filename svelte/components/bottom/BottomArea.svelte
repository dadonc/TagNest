<script lang="ts">
  import Preview from "../main/Preview.svelte";
  import { currentRoute, selectedItems } from "../../stores/stateStore";
  import { handleKeydownDetailsView } from "../../utils";
  import type { SingleItem } from "../../stores/items";
  import { onMount } from "svelte";
  import { bottomContainer, rightContainer } from "../../stores/cssStore";

  export let items: SingleItem[];

  onMount(() => {
    $rightContainer.currentVal = "0px";
    $bottomContainer.currentVal = $bottomContainer.val;
    setTimeout(() => {
      document.getElementById($selectedItems.ids[0])?.scrollIntoView();
    }, 0);
    return () => {
      if ($currentRoute !== "details") {
        $rightContainer.currentVal = $rightContainer.val;
        $bottomContainer.currentVal = "0px";
      }
    };
  });

  // select first item if none is selected, i.e. tag selection was changed
  $: if ($selectedItems.ids.length === 0) {
    $selectedItems.ids = [items[0].id];
  }

  // select the first item if tag selection was changed and current item is not in the selected tags
  $: if (!items.find((i) => i.id === $selectedItems.ids[0])) {
    $selectedItems.ids = [items[0].id];
  }
</script>

<svelte:window on:keydown={handleKeydownDetailsView} />

<div
  id="bottomArea"
  style={$currentRoute == "details"
    ? "max-height: calc(var(--bottomContainer) - var(--bottomAreaPadding) * 2 - 0.5rem)"
    : ""}
>
  {#each items as item}
    <div class="inline-block">
      <Preview {item} {items} />
    </div>
  {/each}
</div>
