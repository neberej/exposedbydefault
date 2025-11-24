import type { FingerprintData } from './types';
import { UAParser } from 'ua-parser-js';

export function getUserAgent(): FingerprintData[] {
  const uaData: any = (navigator as any).userAgentData;
  const uaOverride = uaData ? JSON.stringify(uaData.brands.map((b: any) => `${b.brand} ${b.version}`)) : 'N/A';

  const parser = new UAParser();

  const browser = parser.getBrowser();
  const os = parser.getOS();
  
  const browserDetails = browser && browser.name && `${browser.name} ${browser.version}`;
  const osDetails = os && os.name && `${os.name} ${os.version}`;

  const results = [
    {
      category: 'Device',
      key: 'User Agent',
      value: navigator.userAgent,
      tooltip: 'The browser user agent string. Obtained via navigator.userAgent.'
    },
    {
      category: 'Device',
      key: 'Platform',
      value: navigator.platform,
      tooltip: 'The platform the browser is running on. Obtained via navigator.platform.'
    },
    {
      category: 'Device',
      key: 'Language',
      value: navigator.language || navigator.languages[0],
      tooltip: 'Primary language of the browser. Obtained via navigator.language.'
    },
    {
      category: 'Device',
      key: 'UA Override (userAgentData)',
      value: uaOverride,
      tooltip: 'Modern browsers may provide userAgentData for brands/version override.'
    }
  ];

  if (browserDetails) {
    results.push({
      category: 'Device',
      key: 'Browser',
      value: browserDetails,
      tooltip: "Browser's name and version. Obtained via userAgent."
    })
  }
  if (osDetails) {
    results.push({
      category: 'Device',
      key: 'OS',
      value: osDetails,
      tooltip: "OS's name and version. Obtained via useragent."
    })
  }


  return results;
}
