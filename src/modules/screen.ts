import type { FingerprintData } from './types';

export function getScreenInfo(): FingerprintData[] {
  return [
    {
      category: 'Screen',
      key: 'Resolution',
      value: `${screen.width}×${screen.height}`,
      tooltip: 'Physical screen resolution. Obtained via screen.width and screen.height.'
    },
    {
      category: 'Screen',
      key: 'Color Depth',
      value: `${screen.colorDepth} bits`,
      tooltip: 'Number of bits used per pixel. Obtained via screen.colorDepth.'
    },
    {
      category: 'Screen',
      key: 'Pixel Ratio',
      value: window.devicePixelRatio.toString(),
      tooltip: 'Ratio between physical pixels and CSS pixels. Obtained via window.devicePixelRatio.'
    }
  ];
}