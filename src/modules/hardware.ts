import type { FingerprintData } from './types';

export function getHardwareInfo(): FingerprintData[] {
  const memory = (navigator as any).deviceMemory;
  return [
    {
      category: 'Hardware',
      key: 'Device Memory (approx)',
      value: memory ? `${memory} GiB` : 'Not supported',
      tooltip: 'Approximate device RAM available. Obtained from navigator.deviceMemory.'
    },
    {
      category: 'Hardware',
      key: 'CPU Cores',
      value: navigator.hardwareConcurrency?.toString() || 'Unknown',
      tooltip: 'Number of logical CPU cores. From navigator.hardwareConcurrency.'
    }
  ];
}
