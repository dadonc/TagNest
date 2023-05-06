<script lang="ts">
  import { onMount } from "svelte";
  import type { SingleItem } from "../../stores/items";
  import DetailsViewBookmark from "./DetailsViewBookmark.svelte";
  import { rightContainer } from "../../stores/cssStore";

  export let item: SingleItem;

  onMount(() => {
    $rightContainer.currentVal = "0px";
    console.log($rightContainer);
    return () => {
      $rightContainer.currentVal = $rightContainer.val;
    };
  });
</script>

<div class="flex items-center justify-center">
  {#if item.type === "bookmark"}
    <DetailsViewBookmark {item} />
  {/if}
  {#if item.type === "image"}
    <img src={`file://${item.file?.path}`} alt={item.name} />
  {/if}
</div>
