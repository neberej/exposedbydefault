import type { FingerprintData } from './types';

export function getCSSFeatures(): FingerprintData[] {
  return [
    {
      category: 'Display',
      key: 'Dark Mode',
      value: matchMedia('(prefers-color-scheme: dark)').matches ? 'Yes' : 'No',
      tooltip: 'Indicates if user prefers dark theme. Detected via CSS media query prefers-color-scheme.'
    },
    {
      category: 'Display',
      key: 'Reduced Motion',
      value: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Yes' : 'No',
      tooltip: 'Indicates if user requested reduced motion animations. Via prefers-reduced-motion media query.'
    },
    {
      category: 'Display',
      key: 'High Contrast',
      value: matchMedia('(prefers-contrast: more)').matches ? 'Yes' : 'No',
      tooltip: 'Indicates high contrast preference. From prefers-contrast media query.'
    },
    {
      category: 'Display',
      key: 'Forced Colors',
      value: matchMedia('(forced-colors: active)').matches ? 'Yes' : 'No',
      tooltip: 'Whether forced colors mode is active. Detected via forced-colors media query.'
    },
  ];
}
