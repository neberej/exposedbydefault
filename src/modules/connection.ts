import type { FingerprintData } from './types';

export function getConnectionInfo(): FingerprintData[] {
  const c = (navigator as any).connection;
  if (!c) return [{ category: 'Network', key: 'Connection API', value: 'Not supported', tooltip: 'Browser does not support the Network Information API.' }];

  return [
    { category: 'Network', key: 'Effective Type', value: c.effectiveType || 'Unknown', tooltip: 'Network effective type (e.g., 4g, 3g). Obtained via navigator.connection.effectiveType.' },
    { category: 'Network', key: 'Downlink (Mbps)', value: c.downlink ? String(c.downlink) : 'Unknown', tooltip: 'Approximate downlink speed in megabits per second. Obtained via navigator.connection.downlink.' },
    { category: 'Network', key: 'RTT (ms)', value: c.rtt ? String(c.rtt) : 'Unknown', tooltip: 'Round-trip time of the connection in milliseconds. Obtained via navigator.connection.rtt.' },
    { category: 'Network', key: 'Save Data Mode', value: c.saveData ? 'Enabled' : 'Disabled', tooltip: 'Indicates if user requested reduced data usage. Obtained via navigator.connection.saveData.' },
    { category: 'Network', key: 'Connection Type', value: c.type || 'Unknown', tooltip: 'Connection type (wifi, cellular, etc.). Obtained via navigator.connection.type.' },
  ];
}
