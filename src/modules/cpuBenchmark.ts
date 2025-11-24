import type { FingerprintData } from './types';

export function getCPUBenchmark(): FingerprintData[] {
  const start = performance.now();
  let result = 0;
  for (let i = 0; i < 5_000_000; i++) result += Math.sin(i) * Math.cos(i);
  const time = (performance.now() - start).toFixed(1);

  return [{
    category: 'Performance',
    key: 'CPU Speed (5M ops)',
    value: `${time} ms`,
    tooltip: 'Time taken for 5 million simple math operations. Estimates CPU performance in JavaScript.'
  }];
}
