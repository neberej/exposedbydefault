import type { FingerprintData } from './types';

export async function updateSensorStates(allData: FingerprintData[]) {
  const sensors = [
    { key: 'Accelerometer', className: 'Accelerometer' },
    { key: 'Gyroscope', className: 'Gyroscope' },
    { key: 'Magnetometer', className: 'Magnetometer' }
  ];

  for (const s of sensors) {
    const idx = allData.findIndex(d => d.category === 'Sensors' && d.key === s.key);
    if (idx === -1) continue;

    if (!(s.className in window)) {
      allData[idx].value = 'Not supported';
      allData[idx].tooltip = `The ${s.key} is not supported. API not present in this browser.`;
      continue;
    }

    let SensorClass: any = (window as any)[s.className];
    let sensor: any;

    try {
      sensor = new SensorClass({ frequency: 1 });
      sensor.addEventListener('reading', () => {
        allData[idx].value = 'Available';
        allData[idx].tooltip = `${s.key} is available and accessible. Detected by creating a sensor instance and receiving readings.`;
        sensor.stop();
      });
      sensor.addEventListener('error', () => {
        allData[idx].value = 'Blocked or No Permission';
        allData[idx].tooltip = `${s.key} is blocked or requires permission. Detected by sensor error events.`;
        sensor.stop();
      });

      sensor.start();

      setTimeout(() => {
        if (allData[idx].value === 'Checking...') {
          allData[idx].value = 'Blocked / Requires Permission';
          allData[idx].tooltip = `${s.key} did not respond. Possibly blocked or permission required.`;
        }
      }, 500);
    } catch (err: any) {
      allData[idx].value = err.name === 'SecurityError' ? 'Permission Required' : 'Blocked';
      allData[idx].tooltip = `${s.key} cannot be accessed. Caught during sensor initialization.`;
    }
  }
}
