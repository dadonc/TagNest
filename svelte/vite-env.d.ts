/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelte.JSX {
  interface DOMAttributes<T> {
    onenterViewport: () => void;
    onexitViewport: () => void;
  }
}

interface Window {
  addHighlight: (bookmarkId?: string) => void;
  removeHighlight: (target: HTMLElement) => void;
  restoreHighlights: (rangeDataString: string, doc: Document) => void;
}
