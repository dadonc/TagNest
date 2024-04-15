<script lang="ts">
  import type { BookmarkHighlight } from "@prisma/client";
  import { type SingleItem } from "../../stores/items";

  export let selectedItem: SingleItem;

  let highlights: BookmarkHighlight[] = [];

  $: {
    if (selectedItem && selectedItem.bookmark) {
      highlights = selectedItem.bookmark.BookmarkHighlight.sort(
        (a, b) => a.position - b.position
      );
    }
  }

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

<div>
  {#each highlights as highlight}
    <button
      class="w-full p-2 text-sm text-left border border-transparent outline-none focus:border-black"
      on:click={() => scrollToElementInsideIframe(highlight.id)}
    >
      {highlight.text}
    </button>
  {/each}
</div>

<style>
  button {
    outline: none;
    border-top: 1px solid black;
  }

  button:first-child {
    border-top: 1px solid transparent;
  }

  button:first-child:focus {
    border-top: 1px solid black;
  }

  button:focus + button {
    /*  remove border from the next button */
    border: 1px solid transparent;
  }
</style>
