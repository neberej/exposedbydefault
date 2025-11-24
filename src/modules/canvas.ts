import { murmurhash3 } from './hash';
import type { FingerprintData } from './types';

export function getCanvasFingerprint(): FingerprintData[] {
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 150;
  const ctx = canvas.getContext('2d')!;

  // Draw baseline shapes
  ctx.fillStyle = '#f60';
  ctx.fillRect(10, 10, 100, 40);
  ctx.fillStyle = '#069';
  ctx.fillRect(50, 50, 120, 40);

  // Emoji + fallback behavior
  ctx.font = '32px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
  ctx.fillText('😀🔥✨🧩', 10, 100);

  // TextMetrics
  ctx.font = '16px Arial';
  const metrics = ctx.measureText('fingerprint-test-string-123');
  const metricsData = [
    metrics.width,
    metrics.actualBoundingBoxAscent,
    metrics.actualBoundingBoxDescent,
    metrics.actualBoundingBoxLeft,
    metrics.actualBoundingBoxRight
  ].join(',');

  // Winding rule test
  ctx.beginPath();
  ctx.arc(150, 75, 40, 0, Math.PI * 2, true);
  ctx.arc(150, 75, 20, 0, Math.PI * 2, true);
  ctx.fill('evenodd');
  const windingTest = ctx.isPointInPath(150, 75, 'evenodd') ? 'yes' : 'no';

  // Compositing
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.fillRect(0, 0, 120, 120);

  // Color space
  ctx.fillStyle = 'color(display-p3 1 0.5 0)';
  ctx.fillRect(120, 0, 80, 80);

  const dataURL = canvas.toDataURL('image/png');
  const hash = murmurhash3(dataURL + metricsData + windingTest);

  return [
    {
      category: 'Canvas',
      key: 'Deep Fingerprint Hash',
      value: hash,
      tooltip: 'High entropy canvas fingerprint including emoji rendering, text metrics, winding rules, color spaces.'
    },
    {
      category: 'Canvas',
      key: 'Winding Rule Support',
      value: windingTest,
      tooltip: 'Tests evenodd fill rule & path handling.'
    },
    {
      category: 'Canvas',
      key: 'TextMetrics',
      value: metricsData,
      tooltip: 'Detailed text metrics including actual bounding boxes.'
    },
    {
      category: 'Canvas',
      key: 'Raw (truncated)',
      value: dataURL.slice(0, 80) + '...',
      tooltip: 'Raw canvas representation.'
    }
  ];
}
