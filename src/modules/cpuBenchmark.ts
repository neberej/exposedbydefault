import type { FingerprintData } from './types';

export function getCPUBenchmark(): FingerprintData[] {
  const results: FingerprintData[] = [];

  // Pure CPU Math Benchmark
  const cpuStart = performance.now();
  let r = 0;
  for (let i = 0; i < 5_000_000; i++) r += Math.sin(i) * Math.cos(i);
  const cpuTime = (performance.now() - cpuStart).toFixed(1);

  results.push({
    category: 'Performance',
    key: 'CPU Math (5M ops)',
    value: `${cpuTime} ms`,
    tooltip: 'Math-heavy operations. Rough CPU throughput estimate.'
  });

  // JIT Warmup Time
  function jitFunction(x: number) {
    return (x * 13.37) / 7.1 + Math.sqrt(x);
  }

  const jitStart = performance.now();
  for (let i = 0; i < 200_000; i++) jitFunction(i);
  const jitTime = (performance.now() - jitStart).toFixed(1);

  results.push({
    category: 'Performance',
    key: 'JIT Warmup',
    value: `${jitTime} ms`,
    tooltip:
      'Measures how quickly the JS engine optimizes a function. Detects V8/Turbofan vs SpiderMonkey vs WebKit.'
  });

  // String Operations Benchmark
  const sStart = performance.now();
  let str = '';
  for (let i = 0; i < 50_000; i++) str += String(i);
  const sTime = (performance.now() - sStart).toFixed(1);

  results.push({
    category: 'Performance',
    key: 'String Ops (concat 50k)',
    value: `${sTime} ms`,
    tooltip: 'Measures JS engine string concatenation performance.'
  });

  // Micro-DOM Performance Benchmark
  const domStart = performance.now();
  for (let i = 0; i < 3000; i++) {
    const el = document.createElement('div');
    el.textContent = 'x';
    document.body.appendChild(el);
    document.body.removeChild(el);
  }
  const domTime = (performance.now() - domStart).toFixed(1);

  results.push({
    category: 'Performance',
    key: 'DOM Ops (3k nodes)',
    value: `${domTime} ms`,
    tooltip:
      'DOM creation & deletion speed. Differs heavily across browsers + devices.'
  });

  // Style Recalculation Timing
  const styleDiv = document.createElement('div');
  styleDiv.style.position = 'absolute';
  document.body.appendChild(styleDiv);

  const styleStart = performance.now();
  for (let i = 0; i < 2000; i++) {
    styleDiv.style.borderWidth = `${i % 5}px`;
  }
  const styleTime = (performance.now() - styleStart).toFixed(1);

  results.push({
    category: 'Performance',
    key: 'Style Recalc Timing',
    value: `${styleTime} ms`,
    tooltip: 'Measures cost of recalculating style changes (CSS engine speed).'
  });

  // Forced Layout Timing (sync layout)
  const layoutDiv = document.createElement('div');
  layoutDiv.style.width = '50px';
  layoutDiv.style.height = '50px';
  layoutDiv.style.position = 'absolute';
  document.body.appendChild(layoutDiv);

  const forcedStart = performance.now();
  for (let i = 0; i < 2000; i++) {
    layoutDiv.style.width = `${50 + (i % 5)}px`;
    void layoutDiv.offsetHeight; // forces layout sync
  }
  const forcedTime = (performance.now() - forcedStart).toFixed(1);

  results.push({
    category: 'Performance',
    key: 'Forced Layout Timing',
    value: `${forcedTime} ms`,
    tooltip:
      'Measures cost of forced synchronous layout (layout thrash detection).'
  });

  // Layout Thrash
  const thrashDiv = document.createElement('div');
  thrashDiv.style.position = 'absolute';
  document.body.appendChild(thrashDiv);

  const thrashStart = performance.now();
  for (let i = 0; i < 1500; i++) {
    thrashDiv.style.padding = `${i % 8}px`;
    const _ = thrashDiv.offsetWidth; // read + write causes thrash
  }
  const thrashTime = (performance.now() - thrashStart).toFixed(1);

  results.push({
    category: 'Performance',
    key: 'Layout Thrash',
    value: `${thrashTime} ms`,
    tooltip:
      'Measures write→read→write cycles. Detects poor layout performance & browser engine differences.'
  });

  document.body.removeChild(styleDiv);
  document.body.removeChild(layoutDiv);
  document.body.removeChild(thrashDiv);

  return results;
}
