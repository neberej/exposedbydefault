import type { FingerprintData } from './types';

type TestConfig = {
  label: string;
  contentType: string;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
};

const TESTS: TestConfig[] = [
  {
    label: 'H.264 1080p',
    contentType: 'video/mp4; codecs="avc1.42E01E"',
    width: 1920,
    height: 1080,
    bitrate: 5_000_000,
    framerate: 30,
  },
  {
    label: 'VP9 4K',
    contentType: 'video/webm; codecs="vp09.00.51.08"',
    width: 3840,
    height: 2160,
    bitrate: 15_000_000,
    framerate: 30,
  },
  {
    label: 'AV1 4K',
    contentType: 'video/mp4; codecs="av01.0.08M.08"',
    width: 3840,
    height: 2160,
    bitrate: 15_000_000,
    framerate: 30,
  },
];

export async function getMediaCapabilities(): Promise<FingerprintData[]> {
  if (!navigator.mediaCapabilities?.decodingInfo) {
    return [{
      category: 'Media',
      key: 'MediaCapabilities API',
      value: 'Not supported',
      tooltip: 'MediaCapabilities decodingInfo API is unavailable.',
    }];
  }

  const results: FingerprintData[] = [];

  for (const test of TESTS) {
    try {
      const info = await navigator.mediaCapabilities.decodingInfo({
        type: 'file',
        video: {
          contentType: test.contentType,
          width: test.width,
          height: test.height,
          bitrate: test.bitrate,
          framerate: test.framerate,
        },
      });

      results.push({
        category: 'Media',
        key: test.label,
        value:
          `supported=${info.supported}, ` +
          `smooth=${info.smooth}, ` +
          `powerEfficient=${info.powerEfficient}`,
        tooltip:
          'Playback characteristics reported by navigator.mediaCapabilities.decodingInfo().',
      });
    } catch {
      results.push({
        category: 'Media',
        key: test.label,
        value: 'Rejected / unsupported configuration',
        tooltip: 'The browser rejected this MediaCapabilities configuration.',
      });
    }
  }

  return results;
}