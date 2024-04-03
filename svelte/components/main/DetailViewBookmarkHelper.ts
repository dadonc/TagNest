// @ts-ignore
import mhtml2html from "../../assets/deps/mhtml2html";
import prisma from "../../prisma";

export async function prepareMhtml(bookmarkId: string, mhtmlPath: string) {
  const mhtml = await window.electron.readFile(mhtmlPath);
  let htmlDoc = mhtml2html.convert(mhtml);
  htmlDoc.window.document
    .querySelectorAll("a")
    .forEach((aTag: HTMLAnchorElement) => {
      aTag.setAttribute("target", "_blank");
    });
  const html = new XMLSerializer().serializeToString(htmlDoc.window.document);
  // const doc = await reinsertHighlights(bookmarkId, htmlDoc.window);
  return html;
}

function ensureElement(node: any) {
  while (node && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }
  return node;
}

export function saveHighlight(bookmarkId: string, range: Range) {
  const startContainerPath = getUniquePath(ensureElement(range.startContainer));
  const endContainerPath = getUniquePath(ensureElement(range.endContainer));

  const rangeData = {
    startContainerPath,
    endContainerPath,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
  };

  saveHighlightToDB(bookmarkId, {
    text: range.toString(),
    rangeJSON: JSON.stringify(rangeData),
  });
}

function getUniquePath(element: Node) {
  let path = [];
  while (element && element.nodeType === Node.ELEMENT_NODE) {
    const el = element as Element;
    let selector = el.tagName.toLowerCase();
    let sibling = el;
    let count = 1; // Position among siblings with the same tag name
    while ((sibling = sibling.previousElementSibling as Element) != null) {
      if (sibling.tagName.toLowerCase() === selector) count++;
    }
    selector += ":nth-of-type(" + count + ")";
    path.unshift(selector);
    element = element.parentNode as Element;
  }
  return path.join(" > "); // Create CSS selector
}

function saveHighlightToDB(
  bookmarkId: string,
  highlightData: { text: string; rangeJSON: string }
) {
  prisma.bookmarkHighlight.create({
    data: {
      text: highlightData.text,
      rangeJSON: highlightData.rangeJSON,
      bookmark: {
        connect: {
          id: bookmarkId,
        },
      },
    },
  });
}

export function getHighlightsForBookmark(bookmarkId: string) {
  return prisma.bookmarkHighlight.findMany({
    where: {
      bookmarkId: bookmarkId,
    },
  });
}

async function reinsertHighlights(bookmarkId: string, win: Window) {
  const highlights = await getHighlightsForBookmark(bookmarkId);
  highlights.forEach((highlight) => {
    restoreHighlights(highlight.rangeJSON!);
  });
  return win.document;
}

export function restoreHighlights(rangeDataString: string) {
  const rangeData = JSON.parse(rangeDataString);
  const range = window.document.createRange();

  const startContainer = window.document.querySelector(
    rangeData.startContainerPath
  );
  const endContainer = window.document.querySelector(
    rangeData.endContainerPath
  );

  const startTextNode = findTextNode(startContainer);
  const endTextNode =
    startContainer === endContainer
      ? startTextNode
      : findTextNode(endContainer);

  console.log("startTextNode", startTextNode);
  console.log("endTextNode", endTextNode);

  if (startTextNode && endTextNode) {
    range.setStart(startTextNode, rangeData.startOffset);
    range.setEnd(endTextNode, rangeData.endOffset);

    console.log(window);
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
    addHighlight(window.document);
  }
}

function findTextNode(container: Node) {
  // This function finds the first text node within the given container.
  // Adjust this function if you need to target a different text node.
  return [...container.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE
  );
}

function addHighlight(doc: Document, bookmarkId?: string) {
  console.log("Adding highlight");
  const selection = doc.getSelection();
  console.log(selection!.toString().trim());
  if (!selection || !selection.toString().trim()) return;
  const range = selection.getRangeAt(0);
  if (bookmarkId) {
    saveHighlight(bookmarkId, range);
  }
  const span = doc.createElement("span");
  span.classList.add("highlight");
  span.addEventListener("mouseup", (e) => {
    // showRemoveTooltip(e);
  });
  span.style.backgroundColor = "yellow";
  try {
    range.surroundContents(span);
  } catch (e) {
    console.error("Error surrounding contents:", e);
  }
  selection.empty();
  // removeTooltip();
}
