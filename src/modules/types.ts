export interface FingerprintData {
  category: string;
  key: string;
  value: string;
  // If set, its result replaces `value` in the tile after render
  resolve?: () => Promise<string>;
  // If set, pushes repeated value updates to the tile after render
  live?: (set: (value: string) => void) => void;
  tooltip?: string;
}
