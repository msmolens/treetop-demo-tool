export type DemoBookmark = {
  title: string;
  url?: string;
  lastVisitTimeDays?: number;
  children?: DemoBookmark[];
};

export type DemoBookmarks = {
  [key: string]: DemoBookmark[];
};

export type CaptureWindowInfo = {
  filename: string;
  width: number;
  height: number;
  delay?: number;
};

export type OpenWindowInfo = {
  url: string;
  width: number;
  height: number;
};
