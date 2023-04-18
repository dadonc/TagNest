declare global {
  interface Window {
    electron: {
      nodeVersion: () => string;
      chromeVersion: () => string;
      electronVersion: () => string;
      prisma: (a: string) => Promise<any>;
      onOpenAddItem: (a: () => void) => void;
    };
  }
}

export type CssContainerType = {
  val: string;
  currentVal: string;
};
