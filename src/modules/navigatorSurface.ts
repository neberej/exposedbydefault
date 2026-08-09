import type { FingerprintData } from './types';
import { murmurhash3 } from './hash';

function getNavigatorPrototypeProperties(): string[] {
  const properties = new Set<string>();

  try {
    let current: object | null = navigator;

    while (current && current !== Object.prototype) {
      for (const key of Object.getOwnPropertyNames(current)) {
        properties.add(key);
      }

      current = Object.getPrototypeOf(current);
    }
  } catch {
    return [];
  }

  return [...properties].sort();
}

export function getNavigatorSurface(): FingerprintData[] {
  const nav = navigator as Navigator & {
    buildID?: string;
    oscpu?: string;
  };

  const prototypeProperties = getNavigatorPrototypeProperties();

  const pluginNames = Array.from(navigator.plugins || [])
    .map(plugin => plugin.name);

  const mimeTypes = Array.from(navigator.mimeTypes || [])
    .map(type => type.type);

  const surfaceData = {
    properties: prototypeProperties,
    product: navigator.product,
    productSub: navigator.productSub,
    vendor: navigator.vendor,
    vendorSub: navigator.vendorSub,
    buildID: nav.buildID || null,
    oscpu: nav.oscpu || null,
    pdfViewerEnabled: navigator.pdfViewerEnabled ?? null,
    plugins: pluginNames,
    mimeTypes,
  };

  return [
    {
      category: 'Browser Detection',
      key: 'Product',
      value: navigator.product || 'No value',
      tooltip: 'Legacy browser product identifier exposed by navigator.product.',
    },
    {
      category: 'Browser Detection',
      key: 'Product Sub',
      value: navigator.productSub || 'No value',
      tooltip: 'Legacy product subdivision exposed by navigator.productSub.',
    },
    {
      category: 'Browser Detection',
      key: 'Vendor',
      value: navigator.vendor || 'No value',
      tooltip: 'Browser vendor string exposed by navigator.vendor.',
    },
    {
      category: 'Browser Detection',
      key: 'Vendor Sub',
      value: navigator.vendorSub || 'No value',
      tooltip: 'Browser vendor subdivision exposed by navigator.vendorSub.',
    },
    {
      category: 'Browser Detection',
      key: 'Build ID',
      value: nav.buildID || 'Not exposed',
      tooltip: 'Browser build identifier when exposed.',
    },
    {
      category: 'Browser Detection',
      key: 'OS CPU',
      value: nav.oscpu || 'Not exposed',
      tooltip: 'Operating-system and CPU information exposed by some browsers.',
    },
    {
      category: 'Browser Detection',
      key: 'PDF Viewer Enabled',
      value:
        typeof navigator.pdfViewerEnabled === 'boolean'
          ? navigator.pdfViewerEnabled ? 'Yes' : 'No'
          : 'Not exposed',
      tooltip: 'Whether the browser reports an integrated PDF viewer.',
    },
    {
      category: 'Browser Detection',
      key: 'Plugins',
      value: pluginNames.length ? pluginNames.join(', ') : 'None',
      tooltip: 'Plugin names exposed through navigator.plugins.',
    },
    {
      category: 'Browser Detection',
      key: 'MIME Types',
      value: mimeTypes.length ? mimeTypes.join(', ') : 'None',
      tooltip: 'MIME types exposed through navigator.mimeTypes.',
    },
    {
      category: 'JavaScript Engine',
      key: 'Navigator Prototype Properties',
      value: String(prototypeProperties.length),
      tooltip: 'Number of properties exposed across the navigator prototype chain.',
    },
    {
      category: 'JavaScript Engine',
      key: 'Navigator Surface Fingerprint',
      value: murmurhash3(JSON.stringify(surfaceData)),
      tooltip: 'Fingerprint derived from the navigator API surface and browser-specific values.',
    },
  ];
}