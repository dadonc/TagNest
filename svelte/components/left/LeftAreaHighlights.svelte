<script lang="ts">
  import { items } from "../../stores/items";
  import { selectedItems } from "../../stores/stateStore";
  $: selectedItem = $items.filter(
    (item) => item.id === $selectedItems.ids[0]
  )[0];

  // $: highlights = selectedItem.bookmark!.highlight;
  $: console.log(selectedItem);
</script>

{#if selectedItem && selectedItem.bookmark}
  {#each selectedItem.bookmark.BookmarkHighlight as highlight}
    <div class="p-2 mb-4 text-sm font-bold">{highlight.text}</div>
  {/each}
{/if}
