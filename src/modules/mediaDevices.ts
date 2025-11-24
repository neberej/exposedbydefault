import type { FingerprintData } from './types';

export async function getMediaDevices(): Promise<FingerprintData[]> {
  if (!navigator.mediaDevices?.enumerateDevices) {
    return [{ category: 'Hardware', key: 'Media Devices', value: 'Not supported', tooltip: 'MediaDevices API unavailable.' }];
  }

  const devices = await navigator.mediaDevices.enumerateDevices();
  const counts = devices.reduce((acc, d) => { acc[d.kind] = (acc[d.kind] || 0) + 1; return acc; }, {} as Record<string, number>);

  return [
    { category: 'Hardware', key: 'Cameras', value: String(counts['videoinput'] || 0), tooltip: 'Number of connected video input devices. From navigator.mediaDevices.enumerateDevices.' },
    { category: 'Hardware', key: 'Microphones', value: String(counts['audioinput'] || 0), tooltip: 'Number of connected audio input devices. From navigator.mediaDevices.enumerateDevices.' },
    { category: 'Hardware', key: 'Audio Outputs', value: String(counts['audiooutput'] || 0), tooltip: 'Number of audio output devices. From navigator.mediaDevices.enumerateDevices.' }
  ];
}
