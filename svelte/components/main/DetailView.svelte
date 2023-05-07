<script lang="ts">
  import { onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";
  import DetailsViewBookmark from "./DetailsViewBookmark.svelte";
  import { bottomContainer, rightContainer } from "../../stores/cssStore";
  import { currView } from "../../stores/stateStore";

  export let item: SingleItem;

  onMount(() => {
    $rightContainer.currentVal = "0px";
    $bottomContainer.currentVal = $bottomContainer.val;
    return () => {
      if ($currView.route !== "details") {
        $bottomContainer.currentVal = "0px";
        $rightContainer.currentVal = $rightContainer.val;
      }
    };
  });
</script>

<div class="flex items-center justify-center h-full">
  {#if item.type === "bookmark"}
    <DetailsViewBookmark {item} />
  {/if}
  {#if item.type === "image"}
    <img src={`file://${item.file?.path}`} alt={item.name} class="max-h-full" />
  {/if}
</div>
