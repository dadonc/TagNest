<script lang="ts">
  import { currentRoute, selectedItems } from "../../stores/stateStore";
  import type { SingleItem } from "../../stores/items";
  import { onMount } from "svelte";
  import { bottomContainer, rightContainer } from "../../stores/cssStore";
  import MainGridItems from "../main/MainGridItems.svelte";

  export let items: SingleItem[];

  onMount(() => {
    $rightContainer.currentVal = "0px";
    $bottomContainer.currentVal = $bottomContainer.val;
    setTimeout(() => {
      document
        .getElementById("bottom_" + $selectedItems.ids[0])
        ?.scrollIntoView();
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
    // can be undefined if no items are present due to search input
    if (items[0]) {
      $selectedItems.ids = [items[0].id];
    }
  }
</script>

<div
  id="bottomArea"
  style={$currentRoute == "details"
    ? "max-height: calc(var(--bottomContainer) - var(--bottomAreaPadding) * 2 - 0.5rem)"
    : ""}
>
  {#if $bottomContainer.currentVal !== "0px"}
    <MainGridItems {items} isBottomGrid={true} />
  {/if}
</div>
