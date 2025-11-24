import { murmurhash3 } from './hash';
import type { FingerprintData } from './types';

export function getAudioFingerprint(): FingerprintData[] {
  const result: FingerprintData[] = [];
  try {
    const AudioContext = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    const context = new AudioContext(1, 5000, 44100);
    const oscillator = context.createOscillator();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 10000;

    const compressor = context.createDynamicsCompressor();
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);

    result.push({
      category: 'Audio',
      key: 'Sample Rate',
      value: context.sampleRate.toString(),
      tooltip: 'Indicates the audio sampling rate supported by your device. Obtained from OfflineAudioContext.sampleRate.'
    });

    result.push({
      category: 'Audio',
      key: 'Max Channels',
      value: context.destination.maxChannelCount.toString(),
      tooltip: 'Maximum number of audio channels supported. Obtained from OfflineAudioContext.destination.maxChannelCount.'
    });

    result.push({
      category: 'Audio',
      key: 'OfflineAudioContext',
      value: 'Yes',
      tooltip: 'Whether OfflineAudioContext API is supported. Detected by checking window.OfflineAudioContext.'
    });

    return context.startRendering().then(renderedBuffer => {
      let hash = 0;
      const channelData = renderedBuffer.getChannelData(0);
      for (let i = 4500; i < 5000; i++) hash = (hash * 31 + channelData[i]) | 0;
      const finalHash = murmurhash3(hash.toString());
      result.push({
        category: 'Audio',
        key: 'Audio Fingerprint',
        value: finalHash,
        tooltip: 'Unique audio fingerprint of the device. Calculated by hashing a portion of OfflineAudioContext output buffer.'
      });
      return result;
    }).catch(() => {
      result.push({
        category: 'Audio',
        key: 'Status',
        value: 'Blocked',
        tooltip: 'Audio fingerprinting blocked or unavailable.'
      });
      return result;
    });
  } catch {
    result.push({
      category: 'Audio',
      key: 'Status',
      value: 'Not supported',
      tooltip: 'OfflineAudioContext API is not supported in this browser.'
    });
    return result;
  }
}
