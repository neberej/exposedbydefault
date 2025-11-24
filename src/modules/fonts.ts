import type { FingerprintData } from './types';

const fonts = [
  'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Trebuchet MS',
  'Verdana', 'Helvetica', 'Comic Sans MS', 'Impact', 'Lucida Console',
  'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'Gill Sans',
];

const glyphSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const kerningPairs = ['To', 'AV', 'Wa', 'Yo', 'Ta', 'Vo', 'PA'];

export function getFonts(): FingerprintData[] {
  const detected: string[] = [];
  const test = document.createElement('span');
  test.style.fontSize = '72px';
  test.style.position = 'absolute';
  test.style.left = '-9999px';
  test.textContent = 'mmmmmmmmmm';
  document.body.appendChild(test);

  const baseFonts = ['monospace', 'sans-serif', 'serif'];
  const baseWidths = baseFonts.map(f => {
    test.style.fontFamily = f;
    return test.offsetWidth;
  });

  // Standard font detection
  fonts.forEach(font => {
    for (let i = 0; i < baseFonts.length; i++) {
      test.style.fontFamily = `${font}, ${baseFonts[i]}`;
      if (test.offsetWidth !== baseWidths[i]) {
        detected.push(font);
        break;
      }
    }
  });

  // Glyph width table 
  const glyphWidthTable: Record<string, number> = {};
  test.style.fontFamily = detected[0] || 'serif';

  for (const ch of glyphSet) {
    test.textContent = ch;
    glyphWidthTable[ch] = test.offsetWidth;
  }

  // Kerning fingerprint
  const kerningTable: Record<string, number> = {};
  for (const pair of kerningPairs) {
    test.textContent = pair;
    kerningTable[pair] = test.offsetWidth;
  }

  document.body.removeChild(test);

  return [
    {
      category: 'Fonts',
      key: 'Detected',
      value: detected.length ? detected.join(', ') : 'None detected',
      tooltip: 'List of installed fonts detected via width differences.'
    },
    {
      category: 'Fonts',
      key: 'Count',
      value: detected.length.toString(),
      tooltip: 'Number of detectable system fonts.'
    },
    {
      category: 'Fonts',
      key: 'Glyph Width Table',
      value: JSON.stringify(glyphWidthTable),
      tooltip: 'Per-character width metrics. Extremely unique per system, font renderer, OS & hardware.'
    },
    {
      category: 'Fonts',
      key: 'Kerning Fingerprint',
      value: JSON.stringify(kerningTable),
      tooltip: 'Kerning pair width differences. Highly identifying across OS, font engines, ClearType, CoreText, FreeType.'
    }
  ];
}
