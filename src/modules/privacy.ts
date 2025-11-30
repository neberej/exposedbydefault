import type { FingerprintData } from './types';

// Detect if Do Not Track is enabled in the browser.
export function getDoNotTrackStatus(): FingerprintData {
  let value: string;

  if ('doNotTrack' in navigator) {
    value = navigator.doNotTrack || 'Unknown';
  } else if ((window as any).doNotTrack) {
    value = (window as any).doNotTrack;
  } else if ((navigator as any).msDoNotTrack) {
    value = (navigator as any).msDoNotTrack;
  } else {
    value = 'unsupported';
  }

  return {
    category: 'Privacy',
    key: 'Do Not Track',
    value,
    tooltip: 'Indicates whether the user has enabled Do Not Track in the browser. Useful for detecting privacy preference settings.'
  };
}

// Detect if common trackers are blocked (heuristic).
export async function detectTrackerBlocking(): Promise<FingerprintData> {
  const trackerUrls = [
    'https://www.google-analytics.com/analytics.js',
    'https://www.googletagmanager.com/gtag/js',
    'https://connect.facebook.net/en_US/sdk.js',
  ];

  const results = await Promise.all(
    trackerUrls.map(async (url) => {
      try {
        const response = await fetch(url + '?cachebust=' + Math.random(), {
          method: 'GET',
          mode: 'no-cors',
          cache: 'no-store',
          // @ts-ignore
          credentials: 'omit',
        });

        return false; // not blocked
      } catch (err) {
        // Network error or blocked by extension → very likely blocked
        return true;
      }
    })
  );

  const isBlocked = results.some(blocked => blocked);

  return {
    category: 'Privacy',
    key: 'Tracker Blocking',
    value: isBlocked ? 'Yes' : 'No',
    tooltip: 'Common analytics/tracking scripts are being blocked (e.g. by uBlock Origin, Privacy Badger, Brave Shield, etc.)',
  };
}

// Detect if the browser is in incognito/private mode. (Super unreliable)
export async function detectIncognitoMode(): Promise<FingerprintData> {
  let value = 'Unknown';
  const ua = navigator.userAgent;

  try {
    // Chrome / Edge / Opera
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const quota = await navigator.storage.estimate();
      if (quota.quota && quota.quota < 120_000_000) value = 'Yes (likely incognito)';
      else value = 'No';
    }
    // Safari
    else if (/^((?!chrome|android).)*safari/i.test(ua)) {
      try {
        const db = indexedDB.open('test');
        db.onerror = () => { value = 'Yes (likely private)'; };
        db.onsuccess = () => { value = 'No'; db.result.close(); indexedDB.deleteDatabase('test'); };
      } catch {
        value = 'Yes (likely private)';
      }
    } else {
      value = 'Unknown';
    }
  } catch {
    value = 'Unknown';
  }

  return {
    category: 'Privacy',
    key: 'Incognito / Private Mode',
    value,
    tooltip: 'Detection is heuristic-based; modern browsers may hide private/incognito mode.'
  };
}


export async function getPrivacyInfo(): Promise<FingerprintData[]> {
  const results: FingerprintData[] = [];
  results.push(getDoNotTrackStatus());
  results.push(await detectTrackerBlocking());
  results.push(await detectIncognitoMode());
  return results;
}
