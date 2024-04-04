<script lang="ts">
  import { type SingleItem } from "../../stores/items";

  export let selectedItem: SingleItem;

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
      class="w-full p-2 mb-2 text-sm font-bold border border-transparent outline-none focus:border-black"
      on:click={() => scrollToElementInsideIframe(highlight.id)}
    >
      {highlight.text}
    </button>
  {/each}
{/if}

<style>
  button {
    outline: none;
  }
</style>
