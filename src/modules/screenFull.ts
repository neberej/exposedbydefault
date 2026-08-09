import type { FingerprintData } from './types';

export function getFullScreenInfo(): FingerprintData[] {
  const viewport = window.visualViewport;

  return [
    {
      category: 'Screen',
      key: 'Available Size',
      value: `${screen.availWidth}x${screen.availHeight}`,
      tooltip: 'Screen area available to browser windows.',
    },
    {
      category: 'Screen',
      key: 'Available Origin',
      value: `${screen.availLeft}, ${screen.availTop}`,
      tooltip: 'Position of the available screen area, useful for revealing multi-monitor layouts.',
    },
    {
      category: 'Screen',
      key: 'Screen Position',
      value: `${window.screenX}, ${window.screenY}`,
      tooltip: 'Browser window position relative to the screen coordinate system.',
    },
    {
      category: 'Screen',
      key: 'Inner Window',
      value: `${window.innerWidth}×${window.innerHeight}`,
      tooltip: 'Size of the browser content viewport.',
    },
    {
      category: 'Screen',
      key: 'Outer Window',
      value: `${window.outerWidth}x${window.outerHeight}`,
      tooltip: 'Dimensions of the full browser window including browser chrome.',
    },
    {
      category: 'Screen',
      key: 'Visual Viewport',
      value: viewport
        ? `${viewport.width}x${viewport.height}`
        : 'Not supported',
      tooltip: 'Dimensions of the visual viewport.',
    },
    {
      category: 'Screen',
      key: 'Visual Viewport Scale',
      value: viewport
        ? String(viewport.scale)
        : 'Not supported',
      tooltip: 'Current visual viewport zoom scale.',
    },
    {
      category: 'Screen',
      key: 'Visual Viewport Offset',
      value: viewport
        ? `${viewport.offsetLeft}, ${viewport.offsetTop}`
        : 'Not supported',
      tooltip: 'Visual viewport offset relative to the layout viewport.',
    },
  ];
}