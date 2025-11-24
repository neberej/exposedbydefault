
import { createIcons, icons as lucideIcons } from 'lucide';

// init lucide globally
export function initIcons() {
  const icons = Object.fromEntries(Object.entries(lucideIcons).map(([k, v]) => [k, v]));
  createIcons({ icons });
}

// Get icon name by category
const categoryIconMap: Record<string, string> = {
  Audio: 'Music',
  Browser: 'Monitor',
  Network: 'Globe',
  Capabilities: 'Code',
  Canvas: 'Calculator',
  Display: 'Tv',
  Device: 'Disc',
  Input: 'Gamepad',
  Identity: 'Fingerprint',
  'Geolocation/Time': 'Globe',
  Graphics: 'Image',
  Mobile: 'Phone',
  Environment: 'Hotel',
  Fonts: 'Cctv',
  Performance: 'ChartBar',
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
