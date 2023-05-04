<script lang="ts">
  import type { SingleItem } from "../../stores/items";
  import DetailsViewBookmark from "./DetailsViewBookmark.svelte";

  export let item: SingleItem;
</script>

<h1>Detailview</h1>
{#if item.type === "bookmark"}
  <DetailsViewBookmark {item} />
{/if}
