import type { FingerprintData } from './types';

export function getTimezoneInfo(): FingerprintData[] {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return [{
      category: 'Geolocation/Time',
      key: 'Time Zone',
      value: tz || 'Unknown',
      tooltip: 'Local time zone of the browser. Obtained from Intl.DateTimeFormat().resolvedOptions().timeZone.'
    }];
  } catch {
    return [{
      category: 'Geolocation/Time',
      key: 'Time Zone',
      value: 'Unavailable',
      tooltip: 'Time zone detection failed.'
    }];
  }
}
