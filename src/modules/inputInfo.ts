import type { FingerprintData } from './types';

export function getInputInfo(): FingerprintData[] {
  return [
    {
      category: 'Input',
      key: 'Pointer Type',
      value: navigator.pointerEnabled ? 'Pointer' : 'None',
      tooltip: 'Indicates if a pointing device is available. Checked via navigator.pointerEnabled.'
    },
    {
      category: 'Input',
      key: 'Any Touch Support',
      value: ('ontouchstart' in window) ? 'Yes' : 'No',
      tooltip: 'Detects if touch input is supported. Checked by presence of ontouchstart event.'
    },
    {
      category: 'Input',
      key: 'Hover Capability',
      value: matchMedia('(hover: hover)').matches ? 'Yes' : 'No',
      tooltip: 'Indicates if hovering is possible. Determined via CSS media query hover.'
    },
    {
      category: 'Input',
      key: 'Fine Pointer',
      value: matchMedia('(pointer: fine)').matches ? 'Yes' : 'No',
      tooltip: 'Detects if a precise pointing device exists. Via CSS media query pointer.'
    }
  ];
}
