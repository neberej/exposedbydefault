import type { FingerprintData } from './types';

export function getPhoneFingerprint(): FingerprintData[] {
  const data: FingerprintData[] = [];

  // Mobile Detection
  const ua = navigator.userAgent || '';
  const platform = navigator.platform || '';
  const maxTouch = navigator.maxTouchPoints || 0;

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
                 || (platform === 'MacIntel' && maxTouch > 1);

  // Modern iPads report as MacIntel with touch support
  const isIOS = /iPhone|iPod/.test(ua) ||
                (platform === 'iPad' || (platform === 'MacIntel' && maxTouch > 1));

  const isAndroid = /Android/.test(ua);

  data.push(
    {
      category: 'Mobile',
      key: 'Is Mobile Device',
      value: isMobile ? 'Yes' : 'No',
      tooltip: 'Indicates whether the current device is a mobile device. Determined by matching the user agent against common mobile patterns.'
    },
    {
      category: 'Mobile',
      key: 'Is iOS',
      value: isIOS ? 'Yes' : 'No',
      tooltip: 'Indicates if the device runs iOS. Detected via user agent or platform with touch support for modern iPads.'
    },
    {
      category: 'Mobile',
      key: 'Is Android',
      value: isAndroid ? 'Yes' : 'No',
      tooltip: 'Indicates if the device runs Android. Determined by checking the user agent string for "Android".'
    },
    {
      category: 'Mobile',
      key: 'Touch Support',
      value: 'ontouchstart' in window ? 'Yes' : 'No',
      tooltip: 'Shows whether the device supports touch input. Detected by checking if the "ontouchstart" event exists on the window.'
    },
    {
      category: 'Mobile',
      key: 'Max Touch Points',
      value: maxTouch.toString(),
      tooltip: 'Maximum number of simultaneous touch points supported by the device. Obtained from navigator.maxTouchPoints.'
    }
  );

  // Sensor Permissions (Accelerometer, Gyroscope, etc.)
  data.push(
    {
      category: 'Sensors',
      key: 'Accelerometer',
      value: 'Checking...',
      tooltip: 'Measures acceleration of the device along 3 axes. Placeholder—actual permission checked asynchronously.'
    },
    {
      category: 'Sensors',
      key: 'Gyroscope',
      value: 'Checking...',
      tooltip: 'Measures rotation rate around the device axes. Placeholder—actual permission checked asynchronously.'
    },
    {
      category: 'Sensors',
      key: 'Magnetometer',
      value: 'Checking...',
      tooltip: 'Detects the magnetic field around the device. Placeholder—actual permission checked asynchronously.'
    },
    {
      category: 'Sensors',
      key: 'Proximity Sensor',
      value: 'Not standard',
      tooltip: 'Detects nearby objects without physical contact. Not standardized across browsers, so usually unavailable.'
    }
  );

  // Legacy DeviceMotion / DeviceOrientation
  data.push(
    {
      category: 'Sensors',
      key: 'DeviceMotion API',
      value: 'DeviceMotionEvent' in window ? 'Yes' : 'No',
      tooltip: 'Indicates if the DeviceMotion API is supported. Detected by checking for "DeviceMotionEvent" in the window object.'
    },
    {
      category: 'Sensors',
      key: 'DeviceOrientation API',
      value: 'DeviceOrientationEvent' in window ? 'Yes' : 'No',
      tooltip: 'Indicates if the DeviceOrientation API is supported. Detected by checking for "DeviceOrientationEvent" in the window object.'
    }
  );

  // Visual Viewport
  if (visualViewport) {
    const locationBarVisible = visualViewport.height < window.innerHeight;
    data.push(
      {
        category: 'Mobile',
        key: 'Location Bar Visible',
        value: locationBarVisible ? 'Yes' : 'No',
        tooltip: 'Shows if the browser location bar is visible. Determined by comparing visualViewport height to window.innerHeight.'
      },
      {
        category: 'Mobile',
        key: 'Visual Viewport Height',
        value: visualViewport.height.toString(),
        tooltip: 'Height of the visible portion of the page. Obtained from window.visualViewport.height.'
      }
    );
  }

  return data;
}
