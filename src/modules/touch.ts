import type { FingerprintData } from './types';

export function getTouchInfo(): FingerprintData[] {
  const hasTouch = 'ontouchstart' in window;
  const maxTouch = (navigator as any).maxTouchPoints || 0;

  return [
    { category: 'Input', key: 'Touch Support', value: hasTouch ? 'Yes' : 'No', tooltip: 'Detects if touch input exists. Checked by ontouchstart event.' },
    { category: 'Input', key: 'Max Touch Points', value: maxTouch.toString(), tooltip: 'Maximum number of simultaneous touch points. From navigator.maxTouchPoints.' },
  ];
}
