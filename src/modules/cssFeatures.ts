import type { FingerprintData } from './types';

export function getCSSFeatures(): FingerprintData[] {
  const results: FingerprintData[] = [];

  // Media Queries
  const darkMode = matchMedia('(prefers-color-scheme: dark)').matches;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const highContrast = matchMedia('(prefers-contrast: more)').matches;
  const forcedColors = matchMedia('(forced-colors: active)').matches;

  const gamutP3 = matchMedia('(color-gamut: p3)').matches;
  const gamutRec2020 = matchMedia('(color-gamut: rec2020)').matches;
  const hdr = matchMedia('(dynamic-range: high)').matches;

  results.push(
    {
      category: 'Display',
      key: 'Dark Mode',
      value: darkMode ? 'Yes' : 'No',
      tooltip: 'Detected via prefers-color-scheme media query.'
    },
    {
      category: 'Display',
      key: 'Reduced Motion',
      value: reducedMotion ? 'Yes' : 'No',
      tooltip: 'Detected via prefers-reduced-motion media query.'
    },
    {
      category: 'Display',
      key: 'High Contrast',
      value: highContrast ? 'Yes' : 'No',
      tooltip: 'Detected via prefers-contrast media query.'
    },
    {
      category: 'Display',
      key: 'Forced Colors',
      value: forcedColors ? 'Yes' : 'No',
      tooltip: 'Detected via forced-colors media query.'
    },
    {
      category: 'Display',
      key: 'Color Gamut (P3)',
      value: gamutP3 ? 'Yes' : 'No',
      tooltip: 'Wide color gamut P3 support (color-gamut: p3).'
    },
    {
      category: 'Display',
      key: 'Color Gamut (Rec.2020)',
      value: gamutRec2020 ? 'Yes' : 'No',
      tooltip: 'Ultra-wide color gamut Rec.2020 support.'
    },
    {
      category: 'Display',
      key: 'HDR Support',
      value: hdr ? 'Yes' : 'No',
      tooltip: 'Detected via dynamic-range: high media query.'
    }
  );

  // CSS Supports Tests
  const supports = {
    grid: CSS.supports('display', 'grid'),
    subgrid: CSS.supports('grid-template-columns', 'subgrid'),
    contain: CSS.supports('contain', 'layout'),
    backdropFilter: CSS.supports('backdrop-filter', 'blur(5px)'),
    colorFunction: CSS.supports('color', 'display-p3 1 0.5 0'),
    variableFonts: CSS.supports('font-variation-settings', '"wght" 350'),
    scrollTimeline: CSS.supports('scroll-timeline-name', 'test'),
  };

  Object.entries(supports).forEach(([key, value]) => {
    results.push({
      category: 'CSS Features',
      key,
      value: value ? 'Yes' : 'No',
      tooltip: `CSS.supports("${key}")`
    });
  });

  // Browser Vendor Hacks
  const chromeUA = CSS.supports('selector(::-webkit-scrollbar)');
  const firefoxUA = CSS.supports('selector(:-moz-focusring)');
  const safariUA =
    CSS.supports('image-rendering', 'pixelated') &&
    !CSS.supports('scrollbar-width', 'thin');

  results.push(
    {
      category: 'Browser Detection',
      key: 'Chrome Selector Support',
      value: chromeUA ? 'Yes' : 'No',
      tooltip: 'Checks ::-webkit-scrollbar selector.'
    },
    {
      category: 'Browser Detection',
      key: 'Firefox Selector Support',
      value: firefoxUA ? 'Yes' : 'No',
      tooltip: 'Checks :-moz-focusring selector.'
    },
    {
      category: 'Browser Detection',
      key: 'Safari Selector Heuristic',
      value: safariUA ? 'Yes' : 'No',
      tooltip: 'Safari-specific selector behavior.'
    }
  );

  // Scrollbar width
  const scrollbarWidth = (() => {
    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.overflow = 'scroll';
    div.style.position = 'absolute';
    div.style.left = '-9999px';

    document.body.appendChild(div);
    const width = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return width;
  })();

  results.push({
    category: 'Layout',
    key: 'Scrollbar Width',
    value: scrollbarWidth + 'px',
    tooltip: 'Detects system scrollbar style (overlay vs classic).'
  });

  return results;
}
