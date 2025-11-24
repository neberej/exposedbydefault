import type { FingerprintData } from './types';

const fonts = [
  'Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Trebuchet MS',
  'Verdana', 'Helvetica', 'Comic Sans MS', 'Impact', 'Lucida Console',
  'Palatino', 'Garamond', 'Bookman', 'Avant Garde', 'Gill Sans',
];

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

  fonts.forEach(font => {
    for (let i = 0; i < baseFonts.length; i++) {
      test.style.fontFamily = `${font}, ${baseFonts[i]}`;
      if (test.offsetWidth !== baseWidths[i]) {
        detected.push(font);
        break;
      }
    }
  });

  document.body.removeChild(test);

  return [
    {
      category: 'Fonts',
      key: 'Detected',
      value: detected.length > 0 ? detected.join(', ') : 'None detected',
      tooltip: 'List of fonts available on the system. Detected by comparing rendered text width against base fonts.'
    },
    {
      category: 'Fonts',
      key: 'Count',
      value: detected.length.toString(),
      tooltip: 'Number of fonts detected. Calculated from font detection routine.'
    },
  ];
}
