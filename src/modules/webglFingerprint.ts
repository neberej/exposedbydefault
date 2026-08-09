import type { FingerprintData } from './types';
import { murmurhash3 } from './hash';

type GL = WebGLRenderingContext | WebGL2RenderingContext;

function precision(gl: GL, shader: number, type: number) {
  const p = gl.getShaderPrecisionFormat(shader, type);

  if (!p) return null;

  return {
    rangeMin: p.rangeMin,
    rangeMax: p.rangeMax,
    precision: p.precision,
  };
}

export function getWebGLFingerprint(): FingerprintData[] {
  try {
    const canvas = document.createElement('canvas');

    canvas.width = 256;
    canvas.height = 128;

    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl');

    if (!gl) {
      return [{
        category: 'Graphics',
        key: 'WebGL Fingerprint',
        value: 'Not available',
        tooltip: 'WebGL fingerprinting is unavailable.',
      }];
    }

    const extensions = (gl.getSupportedExtensions() || []).sort();

    const parameterNames = [
      'MAX_TEXTURE_SIZE',
      'MAX_CUBE_MAP_TEXTURE_SIZE',
      'MAX_RENDERBUFFER_SIZE',
      'MAX_VIEWPORT_DIMS',
      'MAX_VERTEX_ATTRIBS',
      'MAX_VERTEX_UNIFORM_VECTORS',
      'MAX_FRAGMENT_UNIFORM_VECTORS',
      'MAX_TEXTURE_IMAGE_UNITS',
      'MAX_COMBINED_TEXTURE_IMAGE_UNITS',
      'ALIASED_LINE_WIDTH_RANGE',
      'ALIASED_POINT_SIZE_RANGE',
      'RED_BITS',
      'GREEN_BITS',
      'BLUE_BITS',
      'ALPHA_BITS',
      'DEPTH_BITS',
      'STENCIL_BITS',
    ];

    const parameters: Record<string, unknown> = {};

    for (const name of parameterNames) {
      const enumValue = (gl as any)[name];

      if (typeof enumValue !== 'number') continue;

      try {
        const value = gl.getParameter(enumValue);

        parameters[name] =
          ArrayBuffer.isView(value)
            ? Array.from(value as any)
            : value;
      } catch {
        parameters[name] = 'Unavailable';
      }
    }

    const shaderPrecision = {
      vertex: {
        lowFloat: precision(gl, gl.VERTEX_SHADER, gl.LOW_FLOAT),
        mediumFloat: precision(gl, gl.VERTEX_SHADER, gl.MEDIUM_FLOAT),
        highFloat: precision(gl, gl.VERTEX_SHADER, gl.HIGH_FLOAT),
        lowInt: precision(gl, gl.VERTEX_SHADER, gl.LOW_INT),
        mediumInt: precision(gl, gl.VERTEX_SHADER, gl.MEDIUM_INT),
        highInt: precision(gl, gl.VERTEX_SHADER, gl.HIGH_INT),
      },
      fragment: {
        lowFloat: precision(gl, gl.FRAGMENT_SHADER, gl.LOW_FLOAT),
        mediumFloat: precision(gl, gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT),
        highFloat: precision(gl, gl.FRAGMENT_SHADER, gl.HIGH_FLOAT),
        lowInt: precision(gl, gl.FRAGMENT_SHADER, gl.LOW_INT),
        mediumInt: precision(gl, gl.FRAGMENT_SHADER, gl.MEDIUM_INT),
        highInt: precision(gl, gl.FRAGMENT_SHADER, gl.HIGH_INT),
      },
    };

    const parameterString = JSON.stringify(parameters);
    const precisionString = JSON.stringify(shaderPrecision);

    return [
      {
        category: 'Graphics',
        key: 'WebGL Extensions Count',
        value: String(extensions.length),
        tooltip: 'Number of WebGL extensions exposed by the browser and graphics stack.',
      },
      {
        category: 'Graphics',
        key: 'WebGL Extensions',
        value: extensions.join(', ') || 'None',
        tooltip: 'Complete list of WebGL extensions exposed by the browser.',
      },
      {
        category: 'Graphics',
        key: 'WebGL Parameters',
        value: parameterString,
        tooltip: 'Graphics limits and implementation-specific WebGL parameters.',
      },
      {
        category: 'Graphics',
        key: 'WebGL Parameters Fingerprint',
        value: murmurhash3(parameterString),
        tooltip: 'Hash of WebGL implementation limits and parameters.',
      },
      {
        category: 'Graphics',
        key: 'Shader Precision',
        value: precisionString,
        tooltip: 'Precision characteristics exposed by vertex and fragment shaders.',
      },
      {
        category: 'Graphics',
        key: 'Shader Precision Fingerprint',
        value: murmurhash3(precisionString),
        tooltip: 'Hash of shader precision characteristics.',
      },
    ];
  } catch {
    return [{
      category: 'Graphics',
      key: 'WebGL Fingerprint',
      value: 'Blocked / failed',
      tooltip: 'Deep WebGL fingerprinting failed or was blocked.',
    }];
  }
}