import type { FingerprintData } from './types';

export async function getIPInfo(): Promise<FingerprintData[]> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();

    return [
      { category: 'Network', key: 'Public IP', value: data.ip || 'Unknown', tooltip: 'Your public IP address. Obtained via external IP API.' },
      { category: 'Network', key: 'ISP', value: data.org || 'Unknown', tooltip: 'Internet Service Provider name. From IP geolocation API.' },
      { category: 'Network', key: 'ASN', value: data.asn || 'Unknown', tooltip: 'Autonomous System Number. Provided by IP geolocation API.' },
      { category: 'Network', key: 'City', value: data.city || 'Unknown', tooltip: 'City of the IP location. From IP geolocation API.' },
      { category: 'Geolocation/Time', key: 'Currency', value: data.currency || 'Unknown', tooltip: 'Local currency at detected location. From IP geolocation API.' },
      { category: 'Geolocation/Time', key: 'Calling Code', value: data.country_calling_code || 'Unknown', tooltip: 'Country calling code. From IP geolocation API.' },
      { category: 'Network', key: 'Country', value: data.country_name || 'Unknown', tooltip: 'Country of IP address. From IP geolocation API.' },
      { category: 'Network', key: 'Latitude/Longitude', value: (data.latitude && data.longitude) ? `${data.latitude}, ${data.longitude}` : 'Unknown', tooltip: 'Geographical coordinates. From IP geolocation API.' },
      { category: 'Network', key: 'Accuracy Radius', value: data.accuracy || data.accuracy_radius ? `±${data.accuracy || data.accuracy_radius} km` : 'Unavailable', tooltip: 'Estimated accuracy radius of location. From IP geolocation API.' },
    ];
  } catch (e) {
    return [
      { category: 'Network', key: 'Public IP', value: 'Blocked or failed', tooltip: 'Could not fetch IP information.' },
      { category: 'Network', key: 'Location', value: 'Unavailable', tooltip: 'Could not fetch geolocation data.' },
    ];
  }
}
