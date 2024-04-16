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
      class="w-full p-2 text-sm text-left border border-transparent outline-none"
      on:click={() => scrollToElementInsideIframe(highlight.id)}
    >
      {highlight.text}
    </button>
  {/each}
</div>

<style>
  button {
    outline: none;
    /* text-content */
    border-top: 1px solid hsl(var(--bc) / 1);
  }

  button:focus {
    border: 1px solid hsl(var(--bc) / 1);
  }

  button:first-child {
    border-top: 1px solid transparent;
    padding-top: 0;
  }

  button:first-child:focus {
    border-top: 1px solid hsl(var(--bc) / 1);
  }

  button:focus + button {
    /*  remove border from the next button */
    border: 1px solid transparent;
  }
</style>
