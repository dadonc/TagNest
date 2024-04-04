<script lang="ts">
  import { items } from "../../stores/items";
  import { selectedItems } from "../../stores/stateStore";
  $: selectedItem = $items.filter(
    (item) => item.id === $selectedItems.ids[0]
  )[0];

  function scrollToElementInsideIframe(highlightId: string) {
    const iframe = document.getElementById(
      "bookmarkIframe"
    ) as HTMLIFrameElement;
    if (!iframe) return;
    const targetElement = iframe.contentDocument!.querySelector(
      `span[data-highlight-id="${highlightId}"]`
    );

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }
</script>

{#if selectedItem && selectedItem.bookmark}
  {#each selectedItem.bookmark.BookmarkHighlight as highlight}
    <button
      class="w-full p-2 mb-4 text-sm font-bold"
      on:click={() => scrollToElementInsideIframe(highlight.id)}
    >
      {highlight.text}
    </button>
  {/each}
{/if}
