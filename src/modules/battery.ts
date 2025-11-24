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

  // Placeholder; real values can be updated asynchronously if desired
  return [
    { category: 'Hardware', key: 'Battery Level', value: 'Loading...', tooltip: 'Shows current battery level as a percentage. Obtained via navigator.getBattery().' },
    { category: 'Hardware', key: 'Charging Status', value: 'Loading...', tooltip: 'Indicates if the device is currently charging. Obtained via navigator.getBattery().' },
    { category: 'Hardware', key: 'Discharging Time', value: 'Loading...', tooltip: 'Estimated time until battery is empty. Obtained via navigator.getBattery().' },
  ];
}
