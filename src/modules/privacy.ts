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
export function detectTrackerBlocking(): Promise<FingerprintData> {
  return new Promise((resolve) => {
    const testUrl = 'https://www.google-analytics.com/analytics.js';
    const img = document.createElement('img');

    img.onload = () => resolve({
      category: 'Privacy',
      key: 'Tracker Blocking',
      value: 'No (resource loaded)',
      tooltip: 'Indicates if a common tracker script or image is blocked by an extension or privacy mode.'
    });

    img.onerror = () => resolve({
      category: 'Privacy',
      key: 'Tracker Blocking',
      value: 'Yes (resource blocked)',
      tooltip: 'Indicates if a common tracker script or image is blocked by an extension or privacy mode.'
    });

    img.src = testUrl + '?rand=' + Math.random();
    img.style.display = 'none';
    document.body.appendChild(img);

    setTimeout(() => {
      document.body.removeChild(img);
    }, 3000);
  });
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
