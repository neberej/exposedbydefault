import type { FingerprintData } from './types';

export async function getWebGPUInfo(): Promise<FingerprintData[]> {
  if (!navigator.gpu) return [{ category: 'Graphics', key: 'WebGPU', value: 'Not supported', tooltip: 'WebGPU API not available in this browser.' }];

  try {
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) return [{ category: 'Graphics', key: 'WebGPU Adapter', value: 'None', tooltip: 'No GPU adapter found.' }];

    return [
      { category: 'Graphics', key: 'GPU Name', value: adapter.name || 'Unknown', tooltip: 'GPU adapter name. From navigator.gpu.requestAdapter().' },
      { category: 'Graphics', key: 'GPU Features', value: Array.from(adapter.features).join(', ') || 'None', tooltip: 'Supported GPU features.' },
      { category: 'Graphics', key: 'Max Buffer Size', value: String(adapter.limits.maxBufferSize), tooltip: 'Maximum buffer size supported by GPU.' }
    ];
  } catch {
    return [{ category: 'Graphics', key: 'WebGPU Error', value: 'Blocked or failed', tooltip: 'Failed to access WebGPU.' }];
  }
}
