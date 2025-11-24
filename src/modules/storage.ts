import type { FingerprintData } from './types';

export function getStorageInfo(): FingerprintData[] {
  return [
    { category: 'Storage', key: 'Cookies Enabled', value: navigator.cookieEnabled ? 'Yes' : 'No', tooltip: 'Whether cookies are enabled. From navigator.cookieEnabled.' },
    { category: 'Storage', key: 'Local storage', value: !!window.localStorage ? 'Yes' : 'No', tooltip: 'Availability of localStorage API.' },
    { category: 'Storage', key: 'Session storage', value: !!window.sessionStorage ? 'Yes' : 'No', tooltip: 'Availability of sessionStorage API.' },
    { category: 'Storage', key: 'IndexedDB', value: !!window.indexedDB ? 'Yes' : 'No', tooltip: 'IndexedDB support detected.' },
    { category: 'Storage', key: 'WebSQL (openDatabase)', value: !!(window as any).openDatabase ? 'Yes' : 'No', tooltip: 'WebSQL database support.' },
    { category: 'Storage', key: 'IE userData', value: 'No (obsolete)', tooltip: 'Legacy IE userData support (obsolete).' },
  ];
}
