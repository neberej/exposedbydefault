// src/utils.ts
import type { FingerprintData } from './modules/types';


// Tooltips on mobile
export function initMobile() {
  document.querySelectorAll('.tile .tooltip').forEach(tooltip => {
    tooltip.addEventListener('click', e => {
      e.stopPropagation();
      tooltip.classList.toggle('active');
    });
  });

  // Close any active tooltip when clicking outside
  document.body.addEventListener('click', () => {
    document.querySelectorAll('.tile .tooltip.active').forEach(t => t.classList.remove('active'));
  });
}


// Safe ID generator for HTML elements
export function safeId(str: string): string {
  return 'section-' + str
    .replace(/[^a-z0-9-]/gi, '-')  // Replace anything not alphanumeric or dash
    .replace(/-+/g, '-')           // Collapse multiple dashes
    .replace(/^-|-$/g, '')         // Trim leading/trailing dashes
    .toLowerCase();
}

// Escape HTML for safe insertion
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}


// Async helper to safely push module data
export async function safePush1<T>(arr: T[], fn: () => Promise<T[] | T>, fallback: T[] = []): Promise<void> {
  try {
    const result = await fn();
    if (Array.isArray(result)) arr.push(...result);
    else arr.push(result);
  } catch {
    arr.push(...fallback);
  }
}

export async function safePush(allData: FingerprintData[], fn: () => FingerprintData[] | Promise<FingerprintData[]>) {
  try {
    const result = await fn(); // works with both sync and async
    allData.push(...result);
  } catch (e) {
    console.error('safePush error', e);
  }
}


export function createTile(item: FingerprintData) {
  const tile = document.createElement('div');
  tile.className = 'tile';

  const shortValue = item.value.length > 168 ? item.value.slice(0, 165) + ' ...' : item.value;

  // Add tooltip if provided
  const tooltipHTML = item.tooltip
    ? `<span class="tooltip">?
         <span class="tooltiptext">${escapeHtml(item.tooltip)}</span>
       </span>`
    : '';

  tile.innerHTML = `
    ${tooltipHTML}
    <h3 class="tile-key">${escapeHtml(item.key)}</h3>
    <p class="tile-value">${escapeHtml(shortValue)}</p>
  `;

  return tile;
}

export function calculateFingerprintUniqueness(allData: FingerprintData[]): number {
  const FEATURE_ENTROPY_BITS: Record<string, number> = {
    'Canvas Fingerprint': 8,
    'Audio Fingerprint': 6,
    'Fonts': 8,
    'WebGL Renderer': 6,
    'WebGL Vendor': 2,
    'Speech Voices': 4,
    'Public IP': 8,
    'Local IPs (WebRTC)': 2,
    'Geolocation': 4,
    'Time Zone': 2,
    'Language': 1,
    'WebCodecs': 1,
    'AV1 Support': 1,
    'HEVC Support': 1,
    'VP9 Support': 1,
    'Device Motion / Orientation': 1,
    'Hardware Threads': 1,
    'Screen Pixel Ratio': 1,
  };

  let totalBits = 0;

  for (const [feature, bits] of Object.entries(FEATURE_ENTROPY_BITS)) {
    const found = allData.find(d => d.key === feature || d.key.includes(feature));
    if (found && found.value) {
      totalBits += bits;
    }
  }

  // Cap at 53 bits for safe JS number
  const cappedBits = Math.min(totalBits, 53);
  return Math.pow(2, cappedBits);
}
