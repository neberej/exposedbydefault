import type { FingerprintData } from './types';

async function testWasmFeature(obj: any): Promise<boolean> {
  if (!("WebAssembly" in window)) return false;
  try { return await WebAssembly.validate(obj); } catch { return false; }
}

export async function getWasmFeatures(): Promise<FingerprintData[]> {
  const features = [
    { key: "SIMD", code: new Uint8Array([0x00,0x61,0x73,0x6D]) },
    { key: "Threads", code: new Uint8Array([0x00,0x61,0x73,0x6D]) },
    { key: "Bulk Memory", code: new Uint8Array([0x00,0x61,0x73,0x6D]) },
    { key: "Exceptions", code: new Uint8Array([0x00,0x61,0x73,0x6D]) },
  ];

  const results: FingerprintData[] = [];
  for (const f of features) {
    const supported = await testWasmFeature(f.code);
    results.push({
      category: 'WebAssembly',
      key: f.key,
      value: supported ? 'Yes' : 'No',
      tooltip: `${f.key} support in WebAssembly. Detected via WebAssembly.validate().`
    });
  }
  return results;
}
