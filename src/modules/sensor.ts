// Streams a sensor's x/y/z readings to the tile, or reports why it can't.
export function streamSensor(name: string): (set: (value: string) => void) => void {
  return set => {
    if (!(name in window)) {
      set('Not supported');
      return;
    }

    try {
      const SensorClass: any = (window as any)[name];
      const sensor = new SensorClass({ frequency: 1 });
      sensor.addEventListener('reading', () => {
        set(`${sensor.x.toFixed(2)}, ${sensor.y.toFixed(2)}, ${sensor.z.toFixed(2)}`);
      });
      sensor.addEventListener('error', () => set('Blocked or No Permission'));
      sensor.start();
    } catch (err: any) {
      set(err?.name === 'SecurityError' ? 'Permission Required' : 'Blocked');
    }
  };
}
