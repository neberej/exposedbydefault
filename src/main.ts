import './main.scss';
import type { FingerprintData } from './modules/types';
import { createIcons, icons as lucideIcons } from 'lucide';
import {
  getUserAgent, getScreenInfo, getWebGLInfo, getHardwareInfo, getTimezoneInfo, getIPInfo,
  getCanvasFingerprint, getAudioFingerprint, getFonts, getBatteryInfo, getWebRTCIPs,
  getCPUBenchmark, getSpeechVoices, getClientHints, getTouchInfo, getFullScreenInfo,
  getTimerResolution, getPhoneFingerprint, getStorageInfo, murmurhash3, getNavigatorInfo,
  getMediaDevices, getPermissionsStatus, getInputInfo, getCSSFeatures, getConnectionInfo,
  getWebGPUInfo, getPWAInfo, updateSensorStates, getMediaCapabilities, getWebCodecs, getWasmFeatures,
  getPrivacyInfo
} from './modules';
import { safeId, createTile, safePush, calculateFingerprintUniqueness } from './utils';
import { getIcon, initIcons } from './icons';

const app = document.getElementById('app')!;

initIcons();

// Dynamic nav creation
function createNav(categories: string[]) {
  return categories.map(cat => `<a href="#${safeId(cat)}" class="nav-item">${cat}</a>`).join('');
}

// Dynamic section creation
function createSections(groups: Record<string, FingerprintData[]>) {
  const sortedCategories = Object.keys(groups).sort();

  return sortedCategories.map(cat => {
    const items = groups[cat];
    const iconName = getIcon(cat);
    const sectionId = safeId(cat);

    return `
      <section id="${sectionId}" class="category-section">
        <div class="section-header">
          <i data-lucide="${iconName}"></i>
          <h2>${cat}</h2>
        </div>
        <div class="grid">
          ${items.map(createTile).map(t => t.outerHTML).join('')}
        </div>
      </section>
    `;
  }).join('');
}

// Render the app
async function renderApp() {
  app.innerHTML = '<div class="loading">Scanning your device...</div>';

  const allData: FingerprintData[] = [];

  // Synchronous modules
  allData.push(
    ...getUserAgent(), ...getScreenInfo(), ...getWebGLInfo(), ...getHardwareInfo(),
    ...getTimezoneInfo(), ...getFonts(), ...getCanvasFingerprint(), ...getBatteryInfo(),
    ...getWebRTCIPs(), ...getCPUBenchmark(), ...getSpeechVoices(), ...getTouchInfo(),
    ...getFullScreenInfo(), ...getTimerResolution(), ...getPhoneFingerprint(), ...getStorageInfo(),
    ...getNavigatorInfo(), ...getInputInfo(), ...getCSSFeatures(), ...getConnectionInfo(),
    ...getPWAInfo()
  );

  // Async modules using safePush
  await safePush(allData, getIPInfo);
  await safePush(allData, getAudioFingerprint);
  await safePush(allData, getClientHints);
  await safePush(allData, getMediaDevices);
  await safePush(allData, getPermissionsStatus);
  await safePush(allData, getWebGPUInfo);
  await safePush(allData, getMediaCapabilities);
  await safePush(allData, getWebCodecs);
  await safePush(allData, getWasmFeatures);
  await safePush(allData, getPrivacyInfo);

  // Sensors
  await updateSensorStates(allData);

  // Fingerprint hash
  const fingerprintString = allData
    .sort((a, b) => a.key.localeCompare(b.key))
    .map(d => `${d.key}:${d.value}`).join('|||');


  const uniquenessNumber = calculateFingerprintUniqueness(allData);

  const finalHash = murmurhash3(fingerprintString);
  allData.push({ category: 'Identity', key: 'Unique Fingerprint ID', value: finalHash });

  // Group by category
  const groups = allData.reduce((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {} as Record<string, FingerprintData[]>);

  const sortedCategories = Object.keys(groups).sort();

  app.innerHTML = `
    <header>
      <h1>
        <span class="word-exposed">Exposed</span>
        <span class="word-by">By</span>
        <span class="word-default">Default</span>
      </h1>
      <p>This is the data your browser hands out automatically, every time!</p>
      <p class="github-link header"><a href="https://github.com/neberej/exposedbydefault"><i data-lucide="Github"></i></a></p>
    </header>

    <nav class="sticky-nav" id="nav">${createNav(sortedCategories)}</nav>

    <div class="summary">
      <p><strong>Fingerprint ID:</strong> <code>${finalHash}</code></p>
      <p>Unique to <strong>1 in ${uniquenessNumber.toLocaleString()}+</strong> devices.</p>
    </div>

    ${createSections(groups)}

    <footer>
      <p>100% client-side demo. No data is transmitted or stored!</p>
      <p class="github-link"><i data-lucide="Github"></i><a href="https://github.com/neberej/exposedbydefault">See on Github</a></p>
      </footer>
  `;

  createIcons({ icons: lucideIcons });

  // Smooth scroll + active nav
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector((link as HTMLAnchorElement).hash)!;
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        const href = `#${entry.target.id}`;
        const activeLink = document.querySelector(`a[href="${href}"]`);
        activeLink?.classList.add('active');
      }
    });
  }, { rootMargin: '-120px 0px -70% 0px' });

  document.querySelectorAll('.category-section').forEach(sec => observer.observe(sec));
}

renderApp();
