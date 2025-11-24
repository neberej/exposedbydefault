export function getNavigatorInfo(): FingerprintData[] {
  return [
    {
      category: 'System',
      key: 'Platform',
      value: navigator.platform || 'Unknown',
      tooltip: 'Platform the browser is running on. Obtained via navigator.platform.'
    },
    {
      category: 'System',
      key: 'Hardware Threads',
      value: String(navigator.hardwareConcurrency || 'Unknown'),
      tooltip: 'Number of logical CPU cores available. Obtained via navigator.hardwareConcurrency.'
    },
    {
      category: 'System',
      key: 'Device Memory (GB)',
      value: navigator.deviceMemory ? navigator.deviceMemory + '' : 'Unknown',
      tooltip: 'Approximate RAM in GiB. Obtained via navigator.deviceMemory.'
    },
    {
      category: 'System',
      key: 'Max Touch Points',
      value: String(navigator.maxTouchPoints),
      tooltip: 'Maximum number of simultaneous touch points supported. Obtained via navigator.maxTouchPoints.'
    }
  ];
}