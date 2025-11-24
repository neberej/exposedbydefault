import type { FingerprintData } from './types';

export function getPhoneFingerprint(): FingerprintData[] {
  const data: FingerprintData[] = [];

  // --- Mobile Detection ---
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  data.push(
    { category: 'Mobile', key: 'Is Mobile Device', value: isMobile ? 'Yes' : 'No', icon: 'monitor' },
    { category: 'Mobile', key: 'Is iOS', value: isIOS ? 'Yes' : 'No', icon: 'monitor' },
    { category: 'Mobile', key: 'Is Android', value: isAndroid ? 'Yes' : 'No', icon: 'monitor' },
    { category: 'Mobile', key: 'Touch Support', value: 'ontouchstart' in window ? 'Yes' : 'No', icon: 'monitor' },
    { category: 'Mobile', key: 'Max Touch Points', value: (navigator.maxTouchPoints || 0).toString(), icon: 'monitor' }
  );

  // --- Sensor Permissions (Accelerometer, Gyroscope, etc.) ---
  const checkSensor = async (name: string, permissionName: PermissionName) => {
    try {
      const status = await navigator.permissions.query({ name: permissionName } as any);
      return status.state === 'granted' ? 'Available' :
             status.state === 'denied' ? 'Blocked' : 'Prompt required';
    } catch {
      return 'Not supported';
    }
  };

  // We'll resolve these async in main.ts (since this function must stay sync)
  // So we return placeholders — main.ts will update them
  data.push(
    { category: 'Sensors', key: 'Accelerometer', value: 'Checking...', icon: 'cpu' },
    { category: 'Sensors', key: 'Gyroscope', value: 'Checking...', icon: 'cpu' },
    { category: 'Sensors', key: 'Magnetometer', value: 'Checking...', icon: 'cpu' },
    { category: 'Sensors', key: 'Proximity Sensor', value: 'Not standard', icon: 'cpu' }
  );

  // --- Legacy DeviceMotion / DeviceOrientation ---
  data.push(
    { category: 'Sensors', key: 'DeviceMotion API', value: 'DeviceMotionEvent' in window ? 'Yes' : 'No', icon: 'cpu' },
    { category: 'Sensors', key: 'DeviceOrientation API', value: 'DeviceOrientationEvent' in window ? 'Yes' : 'No', icon: 'cpu' }
  );

  // --- Visual Viewport (Android Chrome UI bars) ---
  if (visualViewport) {
    const locationBarVisible = visualViewport.height < window.innerHeight;
    data.push(
      { category: 'Mobile', key: 'Location Bar Visible', value: locationBarVisible ? 'Yes' : 'No', icon: 'monitor' },
      { category: 'Mobile', key: 'Visual Viewport Height', value: visualViewport.height.toString(), icon: 'monitor' }
    );
  }

  return data;
}