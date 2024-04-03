<script lang="ts">
  import { onMount, tick } from "svelte";
  import type { SingleItem } from "../../stores/items";
  import LoaderCircle from "../top/LoaderCircle.svelte";
  import { prepareMhtml } from "./DetailViewBookmarkHelper";

  export let item: SingleItem;
  let html: string;
  let displayScreenshot = true;
  let screenshotPath = "file://" + item.bookmark!.screenshotPath;
  let iframe: HTMLIFrameElement;
  let doc: Document;

  onMount(async () => {
    html = await prepareMhtml(item.file!.path as string);
    displayScreenshot = false;

    await tick();

    iframe.onload = () => {
      doc = iframe.contentDocument || iframe.contentWindow!.document;
      exposeFunctionsToIframe();

      doc.addEventListener("mouseup", (e) => {
        const selection = doc.getSelection();
        if (!selection || !selection.toString().trim()) {
          removeTooltip(e);
          return;
        }
        const existingTooltip = doc.getElementById("tooltip");
        if (existingTooltip) {
          existingTooltip.remove();
        } else {
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
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "1000";
    tooltip.style.background = "yellow";
    tooltip.style.padding = "5px";
    doc.body.appendChild(tooltip);
    tooltip.addEventListener("mouseup", () => {
      parent.addHighlight();
    });

    const range = selection.getRangeAt(0).getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();

    tooltip.style.left = `${iframeRect.left + range.left + window.scrollX}px`;
    tooltip.style.top = `${iframeRect.top + range.top + window.scrollY - tooltip.offsetHeight - 15}px`;
  }

  function showRemoveTooltip(e: MouseEvent) {
    const tooltip = doc.createElement("button");
    tooltip.id = "tooltipRmv";
    tooltip.textContent = "Remove Highlight";
    tooltip.style.position = "absolute";
    tooltip.style.zIndex = "1000";
    tooltip.style.background = "yellow";
    tooltip.style.padding = "5px";
    doc.body.appendChild(tooltip);
    tooltip.addEventListener("click", () => {
      parent.removeHighlight(e.target as HTMLElement);
      removeRmvTooltip();
    });
    // @ts-ignore
    const span = e.target.getBoundingClientRect();
    const iframeRect = iframe.getBoundingClientRect();

    tooltip.style.left = `${iframeRect.left + span.left + window.scrollX}px`;
    tooltip.style.top = `${iframeRect.top + span.top + window.scrollY - tooltip.offsetHeight - 15}px`;
  }

  function addHighlight() {
    const selection = doc.getSelection();
    if (!selection || !selection.toString().trim()) return;
    const range = selection.getRangeAt(0);
    const span = doc.createElement("span");
    span.classList.add("highlight");
    span.addEventListener("mouseup", (e) => {
      showRemoveTooltip(e);
    });
    span.style.backgroundColor = "yellow";
    range.surroundContents(span);
    selection.empty();
    removeTooltip();
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
    srcdoc={html}
    class="w-full h-full"
    title={item.name}
  />
{/if}
