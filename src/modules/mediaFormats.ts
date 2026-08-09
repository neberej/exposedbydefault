import type { FingerprintData } from './types';
import { murmurhash3 } from './hash';

const AUDIO_FORMATS = [
  ['MP3', 'audio/mpeg'],
  ['AAC', 'audio/aac'],
  ['FLAC', 'audio/flac'],
  ['Ogg Vorbis', 'audio/ogg; codecs="vorbis"'],
  ['Ogg Opus', 'audio/ogg; codecs="opus"'],
  ['WebM Opus', 'audio/webm; codecs="opus"'],
  ['MP4 AAC', 'audio/mp4; codecs="mp4a.40.2"'],
] as const;

const VIDEO_FORMATS = [
  ['H.264', 'video/mp4; codecs="avc1.42E01E"'],
  ['HEVC', 'video/mp4; codecs="hvc1.1.6.L93"'],
  ['AV1 MP4', 'video/mp4; codecs="av01.0.05M.08"'],
  ['VP8', 'video/webm; codecs="vp8"'],
  ['VP9', 'video/webm; codecs="vp9"'],
  ['AV1 WebM', 'video/webm; codecs="av01.0.05M.08"'],
] as const;

function normalize(result: string): string {
  return result || 'unsupported';
}

export function getMediaFormats(): FingerprintData[] {
  const audio = document.createElement('audio');
  const video = document.createElement('video');

  const audioResults: Record<string, string> = {};
  const videoResults: Record<string, string> = {};

  for (const [label, type] of AUDIO_FORMATS) {
    audioResults[label] = normalize(audio.canPlayType(type));
  }

  for (const [label, type] of VIDEO_FORMATS) {
    videoResults[label] = normalize(video.canPlayType(type));
  }

  const combined = {
    audio: audioResults,
    video: videoResults,
  };

  return [
    {
      category: 'Media',
      key: 'Audio Format Matrix',
      value: Object.entries(audioResults)
        .map(([name, result]) => `${name}: ${result}`)
        .join(' | '),
      tooltip: 'Browser-reported playback confidence for several audio codecs and containers.',
    },
    {
      category: 'Media',
      key: 'Video Format Matrix',
      value: Object.entries(videoResults)
        .map(([name, result]) => `${name}: ${result}`)
        .join(' | '),
      tooltip: 'Browser-reported playback confidence for several video codecs and containers.',
    },
    {
      category: 'Media',
      key: 'Media Format Fingerprint',
      value: murmurhash3(JSON.stringify(combined)),
      tooltip: 'Fingerprint of audio and video format support reported by the browser.',
    },
  ];
}