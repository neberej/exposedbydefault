import type { FingerprintData } from './types';

export function getWebCodecs(): FingerprintData[] {
  const supported = 'VideoDecoder' in window && 'AudioDecoder' in window;
  return [
    { category: 'Capabilities', key: 'WebCodecs', value: supported ? 'Supported' : 'Not supported', tooltip: 'WebCodecs API availability. Checked by VideoDecoder & AudioDecoder presence.' },
    { category: 'Capabilities', key: 'VideoDecoder API', value: 'VideoDecoder' in window ? 'Yes' : 'No', tooltip: 'VideoDecoder API available in browser.' },
    { category: 'Capabilities', key: 'AudioDecoder API', value: 'AudioDecoder' in window ? 'Yes' : 'No', tooltip: 'AudioDecoder API available in browser.' },
  ];
}
