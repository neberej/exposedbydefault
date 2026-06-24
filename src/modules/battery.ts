import type { FingerprintData } from './types';

export function getBatteryInfo(): FingerprintData[] {
  if (!('getBattery' in navigator)) {
    return [{ 
      category: 'Hardware', 
      key: 'Battery API', 
      value: 'Not supported', 
      tooltip: 'Battery info is unavailable. Browser does not expose the Battery API.' 
    }];
  }

  // Call getBattery() once here so all three resolvers await the same promise
  // instead of each requesting the battery separately.
  const battery = (navigator as any).getBattery();
  return [
    { category: 'Hardware', key: 'Battery Level', value: 'Loading...', resolve: async () => `${Math.round((await battery).level * 100)}%`, tooltip: 'Shows current battery level as a percentage. Obtained via navigator.getBattery().' },
    { category: 'Hardware', key: 'Charging Status', value: 'Loading...', resolve: async () => (await battery).charging ? 'Charging' : 'Not charging', tooltip: 'Indicates if the device is currently charging. Obtained via navigator.getBattery().' },
    { category: 'Hardware', key: 'Discharging Time', value: 'Loading...', resolve: async () => { const t = (await battery).dischargingTime; return isFinite(t) ? `${t}s` : 'Unknown'; }, tooltip: 'Estimated time until battery is empty. Obtained via navigator.getBattery().' },
  ];
}
