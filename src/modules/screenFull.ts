import type { FingerprintData } from './types';

export function getFullScreenInfo(): FingerprintData[] {
  return [
    {
      category: 'Screen',
      key: 'Available Size',
      value: `${screen.availWidth}×${screen.availHeight}`,
      tooltip: 'Shows the screen size available for content. Obtained via screen.availWidth and screen.availHeight.'
    },
    {
      category: 'Screen',
      key: 'Outer Window',
      value: `${window.outerWidth}×${window.outerHeight}`,
      tooltip: 'Dimensions of the entire browser window including UI. Obtained via window.outerWidth and window.outerHeight.'
    }
  ];
}