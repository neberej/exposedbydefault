import type { FingerprintData } from './types';

export async function getMediaCapabilities(): Promise<FingerprintData[]> {
  const results: FingerprintData[] = [];

  if (!('mediaCapabilities' in navigator)) {
    return [{ category: 'Media', key: 'MediaCapabilities API', value: 'Not supported', tooltip: 'MediaCapabilities API not available in this browser.' }];
  }

  const videoTypes = [
    { label: 'AV1', type: 'video/mp4; codecs="av01.0.05M.08"' },
    { label: 'HEVC', type: 'video/mp4; codecs="hvc1.1.6.L93"' },
    { label: 'VP9', type: 'video/webm; codecs="vp9"' },
    { label: 'AVIF', type: 'image/avif' },
  ];

  for (const v of videoTypes) {
    const supported = MediaSource?.isTypeSupported ? MediaSource.isTypeSupported(v.type) : false;
    results.push({
      category: 'Media',
      key: `${v.label} Support`,
      value: supported ? 'Yes' : 'No',
      tooltip: `Whether ${v.label} media is supported. Checked via MediaSource.isTypeSupported.`
    });
  }

  const hdr = (navigator.mediaCapabilities as any)?.decodingInfo
    ? await (navigator.mediaCapabilities as any).decodingInfo({
        type: 'file',
        video: {
          contentType: 'video/mp4; codecs="hevc"',
          height: 2160,
          width: 3840,
          bitrate: 10000000,
          framerate: 30,
          transferFunction: 'pq',
        }
      })
    : null;

  results.push({
    category: 'Media',
    key: 'HDR Support',
    value: hdr?.supported ? 'Yes' : 'No',
    tooltip: 'Whether HDR playback is supported. Detected via MediaCapabilities.decodingInfo.'
  });

  return results;
}
