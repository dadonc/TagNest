import type { BookmarkHighlight } from "@prisma/client";
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
  return html;
}

// ========================
// Saving the highlight
// ========================

export function saveHighlight(bookmarkId: string, range: Range) {
  const startContainerPath = getUniquePath(ensureElement(range.startContainer));
  const endContainerPath = getUniquePath(ensureElement(range.endContainer));

  const rangeData = {
    startContainerPath,
    endContainerPath,
    startOffset: range.startOffset,
    endOffset: range.endOffset,
  };

  return saveHighlightToDB(bookmarkId, {
    text: range.toString(),
    rangeJSON: JSON.stringify(rangeData),
  });
}

export async function reorderHighlights(doc: Document) {
  const all = doc.querySelectorAll(`span[data-highlight-id]`);
  let promises = [];
  for (let i = 0; i < all.length; i++) {
    let id = all[i].getAttribute("data-highlight-id");
    if (!id) continue;
    promises.push(updateHighlightPosition(id, i));
  }
  try {
    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
}

function ensureElement(node: any) {
  while (node && node.nodeType !== Node.ELEMENT_NODE) {
    node = node.parentNode;
  }
  return node;
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
  return prisma.bookmarkHighlight.create({
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

async function updateHighlightPosition(id: string, position: number) {
  return prisma.bookmarkHighlight.update({
    where: {
      id: id,
    },
    data: {
      position: position,
    },
  });
}

// ========================
// Restoring the highlight
// ========================

export function getHighlightsForBookmark(bookmarkId: string) {
  return prisma.bookmarkHighlight.findMany({
    where: {
      bookmarkId: bookmarkId,
    },
  });
}

export function restoreHighlights(highlight: BookmarkHighlight, doc: Document) {
  const rangeData = JSON.parse(highlight.rangeJSON!);
  const range = doc.createRange();

  const startContainer = doc.querySelector(rangeData.startContainerPath);
  const endContainer = doc.querySelector(rangeData.endContainerPath);

  const startTextNode = findTextNode(startContainer);
  const endTextNode =
    startContainer === endContainer
      ? startTextNode
      : findTextNode(endContainer);

  if (startTextNode && endTextNode) {
    range.setStart(startTextNode, rangeData.startOffset);
    range.setEnd(endTextNode, rangeData.endOffset);

    const selection = doc.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
    window.addHighlight({ highlightId: highlight.id });
  }
}

function findTextNode(container: Node) {
  return [...container.childNodes].find(
    (node) => node.nodeType === Node.TEXT_NODE
  );
}

// ========================
// Delete the highlight
// ========================
export function deleteHighlight(highlightId: string) {
  prisma.bookmarkHighlight.delete({
    where: {
      id: highlightId,
    },
  });
}
