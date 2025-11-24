import type { FingerprintData } from './types';

export function getPWAInfo(): FingerprintData[] {
  const standalone =
    navigator.standalone ||
    matchMedia('(display-mode: standalone)').matches;

  return [
    {
      category: 'Environment',
      key: 'PWA Standalone',
      value: standalone ? 'Yes' : 'No',
      tooltip: 'Indicates if the app is running as a PWA in standalone mode. Obtained via navigator.standalone or display-mode media query.'
    }
  ];
}
