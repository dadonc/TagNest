declare global {
  interface Window {
    electron: {
      nodeVersion: () => string;
      chromeVersion: () => string;
      electronVersion: () => string;
      prisma: (callback: string) => Promise<any>;
      onOpenAddItem: (a: () => void) => void;
      chooseFile: () => void;
      onChosenFile: (
        callback: (
          ev: Event,
          { base64, path }: { base64: string; path: string }
        ) => void
      ) => void;
      saveFileFromUrl: (url: string) => void;
    };
  }
}

export type CssContainerType = {
  val: string;
  currentVal: string;
};

export type CurrViewType = {
  zoomLvl: number;
};
