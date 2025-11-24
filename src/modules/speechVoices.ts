import type { FingerprintData } from './types';

export function getSpeechVoices(): FingerprintData[] {
  const voices = (speechSynthesis.getVoices() || [])
    .map(v => `${v.name} (${v.lang})`)
    .sort()
    .join(' | ');

  return [
    {
      category: 'Audio',
      key: 'Speech Voices',
      value: voices || 'None',
      tooltip: 'List of available speech synthesis voices. Obtained via speechSynthesis.getVoices().'
    },
    {
      category: 'Audio',
      key: 'Voice Count',
      value: (speechSynthesis.getVoices() || []).length.toString(),
      tooltip: 'Total number of voices available for speech synthesis.'
    }
  ];
}

// Trigger voice loading
speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
