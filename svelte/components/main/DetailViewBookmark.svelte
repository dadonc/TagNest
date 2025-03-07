<script lang="ts">
  import { onMount, tick } from "svelte";
  import { refreshDisplayedItems, type SingleItem } from "../../stores/items";
  import LoaderCircle from "../top/LoaderCircle.svelte";
  import {
    deleteHighlight,
    getHighlightsForBookmark,
    prepareMhtml,
    reorderHighlights,
    restoreHighlights,
    saveHighlight,
  } from "./DetailViewBookmarkHelper";

  export let item: SingleItem;
  let html: string;
  let displayScreenshot = true;
  let screenshotPath = "file://" + item.bookmark!.screenshotPath;
  let iframe: HTMLIFrameElement;
  let doc: Document;

  onMount(async () => {
    html = await prepareMhtml(item.file!.path as string);
    displayScreenshot = false;
    const highlights = await getHighlightsForBookmark(item.bookmark!.id);

    await tick();

    iframe.onload = () => {
      doc = iframe.contentDocument as Document;
      exposeFunctionsToIframe();
      highlights.forEach((highlight) => {
        restoreHighlights(highlight, doc);
      });
      reorderHighlights(doc);

      doc.addEventListener("mouseup", (e) => {
        const selection = doc.getSelection();
        if (!selection || !selection.toString().trim()) {
          removeTooltip(e);
          return;
        }
        const existingTooltip = doc.getElementById("tooltip");
        const existingRmvTooltip = doc.getElementById("tooltipRmv");

        if (existingTooltip) {
          existingTooltip.remove();
        } else if (!existingRmvTooltip) {
          showHighlightTooltip(selection);
        }
      });
      doc.addEventListener("mousedown", (e) => {
        if (e.target !== doc.getElementById("tooltip")) {
          possiblyRemoveTooltip(e);
        }
      });
    };
  });

  function possiblyRemoveTooltip(e?: MouseEvent) {
    const tooltip = doc.getElementById("tooltip");
    const tooltipRmv = doc.getElementById("tooltipRmv");
    if (tooltip && (!e || e.target !== tooltip)) {
      tooltip.remove();
    }
    if (tooltipRmv && (!e || e.target !== tooltipRmv)) {
      tooltipRmv.remove();
    }
  }

  function removeTooltip(e?: MouseEvent) {
    const tooltip = doc.getElementById("tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  }

  function removeRmvTooltip(e?: MouseEvent) {
    const tooltipRmv = doc.getElementById("tooltipRmv");
    if (tooltipRmv) {
      tooltipRmv.remove();
    }
  }

  function showHighlightTooltip(selection: Selection) {
    const tooltip = doc.createElement("button");
    tooltip.id = "tooltip";
    tooltip.textContent = "Highlight";
    tooltip.style.fontSize = "16px";
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "1000";
    tooltip.style.background = "yellow";
    tooltip.style.color = "black";
    tooltip.style.border = "none";
    tooltip.style.padding = "2px 5px";
    doc.body.appendChild(tooltip);
    tooltip.addEventListener("mouseup", () => {
      parent.addHighlight({ bookmarkId: item.bookmark!.id });
    });

    const range = selection.getRangeAt(0).getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();

    const fontSize = getFontSizeFromRange(selection.getRangeAt(0)) || 16;

    tooltip.style.left = `${range.left + doc.documentElement.scrollLeft}px`;
    tooltip.style.top = `${iframeRect.top + range.top + doc.documentElement.scrollTop - tooltip.offsetHeight - 3 * fontSize}px`;
  }

  function showRemoveTooltip(e: MouseEvent) {
    const tooltip = doc.createElement("button");
    tooltip.id = "tooltipRmv";
    tooltip.textContent = "Remove Highlight";
    tooltip.style.fontSize = "16px";
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "1000";
    tooltip.style.background = "#ef4444";
    tooltip.style.color = "white";
    tooltip.style.border = "none";
    tooltip.style.padding = "2px 5px";
    doc.body.appendChild(tooltip);
    tooltip.addEventListener("click", () => {
      parent.removeHighlight(e.target as HTMLElement);
      // @ts-ignore
      const highlightId = e.target.dataset.highlightId;
      if (highlightId) {
        deleteHighlight(highlightId);
        refreshDisplayedItems(
          "Delete Highlight - updateHighlightsInLeftSidebar"
        );
      }
      removeRmvTooltip();
    });
    // @ts-ignore
    const span = e.target.getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();

    let fontSize: string | number = window
      .getComputedStyle(e.target as Element, null)
      .getPropertyValue("font-size");
    fontSize = Number(fontSize.slice(-3) === "rem")
      ? Number(fontSize.slice(0, fontSize.length - 3))
      : Number(fontSize.slice(0, fontSize.length - 2));

    tooltip.style.left = `${span.left + doc.documentElement.scrollLeft}px`;
    tooltip.style.top = `${iframeRect.top + span.top + doc.documentElement.scrollTop - tooltip.offsetHeight - 3 * fontSize}px`;
  }

  async function addHighlight(args: {
    bookmarkId?: string;
    highlightId?: string;
  }) {
    // highlightId is set if the highlight is being restored
    // bookmarkId is set if the highlight is being added for the first time
    const selection = doc.getSelection();
    if (!selection || !selection.toString().trim()) return;
    const range = selection.getRangeAt(0);
    let newId = "";
    if (args.bookmarkId) {
      newId = (await saveHighlight(args.bookmarkId, range)).id;
      console.log("New highlight id:", newId);
    }
    const span = doc.createElement("span");
    if (args.highlightId) {
      span.dataset.highlightId = args.highlightId;
    } else {
      span.dataset.highlightId = newId;
    }
    span.classList.add("highlight");
    span.addEventListener("mouseup", (e) => {
      showRemoveTooltip(e);
    });
    span.style.backgroundColor = "yellow";
    span.style.color = "black";
    span.style.display = "inline";
    try {
      range.surroundContents(span);
      if (newId) {
        await reorderHighlights(doc);
        refreshDisplayedItems("Add Highlight - updateHighlightsInLeftSidebar");
      }
    } catch (e) {
      deleteHighlight(newId);
      console.error("Error surrounding contents:", e);
    } finally {
      selection.empty();
      removeTooltip();
    }
  }

  function removeHighlight(target: HTMLElement) {
    target.classList.remove("highlight");
    target.style.background = "red";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = target.innerHTML;
    // @ts-ignore
    target.parentNode.replaceChild(tempDiv.firstChild, target);
  }

  function exposeFunctionsToIframe() {
    window.addHighlight = addHighlight;
    window.removeHighlight = removeHighlight;
    window.restoreHighlights = restoreHighlights;
  }

  function getFontSizeFromRange(range: Range) {
    const textNode =
      range.startContainer.nodeType === Node.TEXT_NODE
        ? range.startContainer
        : null;
    if (textNode) {
      const parentElement = textNode.parentElement as HTMLElement;
      const computedStyle = window.getComputedStyle(parentElement);
      let fontSize: number | string = computedStyle.fontSize;
      if (!fontSize) {
        fontSize = window
          .getComputedStyle(doc.documentElement, null)
          .getPropertyValue("font-size");
      }
      fontSize = Number(fontSize.slice(-3) === "rem")
        ? Number(fontSize.slice(0, fontSize.length - 3))
        : Number(fontSize.slice(0, fontSize.length - 2));
      return fontSize;
    }
  }
</script>

{#if displayScreenshot}
  <div class="flex items-center justify-center w-full h-full">
    <img src={screenshotPath} alt={item.name} class="max-w-full max-h-full" />
    <LoaderCircle className="absolute w-20 h-20 " />
  </div>
{:else}
  <iframe
    bind:this={iframe}
    id="bookmarkIframe"
    srcdoc={html}
    class="w-full h-full"
    title={item.name}
  />
{/if}
