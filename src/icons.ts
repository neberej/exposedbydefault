
import { createIcons, icons as lucideIcons } from 'lucide';

// init lucide globally
export function initIcons() {
  const icons = Object.fromEntries(Object.entries(lucideIcons).map(([k, v]) => [k, v]));
  console.log(icons)
  createIcons({ icons });
}

// Get icon name by category
const categoryIconMap: Record<string, string> = {
  Audio: 'Music',
  'Browser Detection': 'Chrome',
  Network: 'Globe',
  Capabilities: 'Code',
  'CSS Features': 'Pen',
  Canvas: 'Calculator',
  Display: 'Tv',
  Device: 'Disc',
  Input: 'Gamepad',
  Identity: 'Fingerprint',
  'Geolocation/Time': 'Globe',
  Graphics: 'Image',
  Intl: 'Flag',
  Layout: 'Grid',
  Mobile: 'Phone',
  Environment: 'Hotel',
  Fonts: 'Cctv',
  Performance: 'Gauge',
  Privacy: 'Brain',
  Permissions: 'Camera',
  System: 'Microchip',
  Storage: 'Database',
  Sensors: 'Cpu',
  Hardware: 'Microchip',
  Screen: 'Monitor',
  Touch: 'Touchpad',
  Timer: 'Timer',
  Media: 'Film',
  Connection: 'Network',
  PWA: 'Box',
  Currency: 'CircleDollarSign',
  Phone: 'PhoneForwarded',
  WebAssembly: 'History'
};

// Returns the lucide icon name for a category.
export function getIcon(category: string): string {
  return categoryIconMap[category] || 'Cpu';
}
