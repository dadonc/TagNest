/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelte.JSX {
  interface DOMAttributes<T> {
    onenterViewport: () => void;
    onexitViewport: () => void;
  }
}

type BookmarkHighlight__copy = {
  id: string;
  text: string;
  rangeJSON: string;
  bookmarkId: string;
  position: number;
};

interface Window {
  addHighlight: (args: { bookmarkId?: string; highlightId?: string }) => void;
  removeHighlight: (target: HTMLElement) => void;
  restoreHighlights: (
    highlight: BookmarkHighlight__copy,
    doc: Document
  ) => void;
}
