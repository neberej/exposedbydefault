import type { FingerprintData } from './types';

export function getTimerResolution(): FingerprintData[] {
  const start = performance.now();
  let count = 0;
  while (performance.now() - start < 10) count++;

  return [{
    category: 'Performance',
    key: 'Timer Resolution',
    value: count > 10000 ? 'High (unclamped)' : 'Low (clamped)',
    tooltip: 'Rough measure of performance timer resolution. Determined by looping for 10ms and counting iterations.'
  }];
}
