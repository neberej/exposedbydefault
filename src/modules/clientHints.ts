import type { FingerprintData } from './types';

export async function getClientHints(): Promise<FingerprintData[]> {
  const result: FingerprintData[] = [];

  if (!('userAgentData' in navigator)) {
    result.push({
      category: 'Device',
      key: 'Client Hints',
      value: 'Not supported',
      tooltip: 'Browser does not support navigator.userAgentData. Cannot obtain device hints.'
    });
    return result;
  }

  const ua = (navigator as any).userAgentData;

  const brands = ua.brands.map((b: any) => `${b.brand} ${b.version}`).join(', ');
  result.push({
    category: 'Device',
    key: 'Client Hints Brands',
    value: brands,
    tooltip: 'Browser brands and versions exposed via client hints. Obtained from navigator.userAgentData.brands.'
  });

  const highEntropy = await ua.getHighEntropyValues([
    'architecture', 'bitness', 'fullVersionList', 'platform', 'platformVersion', 'model', 'uaFullVersion'
  ]);

  result.push(
    {
      category: 'Device',
      key: 'Full UA',
      value: highEntropy.uaFullVersion || 'N/A',
      tooltip: 'Full User-Agent string provided by high-entropy client hints. Obtained via navigator.userAgentData.getHighEntropyValues.'
    },
    {
      category: 'Device',
      key: 'Platform',
      value: highEntropy.platform || 'N/A',
      tooltip: 'OS platform of the device. Obtained via high-entropy client hints.'
    },
    {
      category: 'Device',
      key: 'Platform Version',
      value: highEntropy.platformVersion || 'N/A',
      tooltip: 'OS version. Obtained via high-entropy client hints.'
    },
    {
      category: 'Device',
      key: 'Model',
      value: highEntropy.model || 'N/A',
      tooltip: 'Device model if available. From high-entropy client hints.'
    },
    {
      category: 'Device',
      key: 'Architecture',
      value: highEntropy.architecture || 'N/A',
      tooltip: 'CPU architecture (e.g., x86, ARM). From high-entropy client hints.'
    },
    {
      category: 'Device',
      key: 'Bitness',
      value: highEntropy.bitness || 'N/A',
      tooltip: 'OS bitness (32 or 64). From high-entropy client hints.'
    },
  );

  result.push({
    category: 'Device',
    key: 'Mobile',
    value: ua.mobile ? 'Yes' : 'No',
    tooltip: 'Indicates if device is mobile. Obtained from navigator.userAgentData.mobile.'
  });

  const fullBrands = highEntropy.fullVersionList?.map((b: any) => `${b.brand} ${b.version}`).join(', ');
  if (fullBrands) {
    result.push({
      category: 'Device',
      key: 'Full Brand List',
      value: fullBrands,
      tooltip: 'Detailed list of browser brands and versions from high-entropy client hints.'
    });
  }

  return result;
}
