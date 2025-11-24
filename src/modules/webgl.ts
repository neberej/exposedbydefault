import type { FingerprintData } from './types';

export function getWebGLInfo(): FingerprintData[] {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return [{ category: 'Graphics', key: 'Support', value: 'Not available', tooltip: 'WebGL not supported in this browser.' }];

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR);
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);

    return [
      { category: 'Graphics', key: 'Vendor', value: String(vendor), tooltip: 'WebGL vendor name.' },
      { category: 'Graphics', key: 'Renderer', value: String(renderer), tooltip: 'WebGL renderer name.' },
      { category: 'Graphics', key: 'Max Texture Size', value: `${gl.getParameter(gl.MAX_TEXTURE_SIZE)}px`, tooltip: 'Maximum texture size in pixels.' }
    ];
  } catch {
    return [{ category: 'Graphics', key: 'Error', value: 'Blocked / failed', tooltip: 'WebGL detection failed or blocked.' }];
  }
}
