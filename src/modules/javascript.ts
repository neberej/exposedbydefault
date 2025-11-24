import type { FingerprintData } from "./types";

// small helper to safely get keys
function safeKeys(obj: any): string[] {
  try {
    return Object.getOwnPropertyNames(obj);
  } catch {
    return [];
  }
}

// measure timing
function measure(fn: () => void): number {
  const start = performance.now();
  fn();
  return performance.now() - start;
}

// generate an error signature
function getErrorSignature(): string {
  try {
    const e = new Error("x");
    return [
      e.name,
      e.message,
      e.stack?.split("\n")[1]?.trim() || "no_stack"
    ].join(" | ");
  } catch {
    return "unavailable";
  }
}

// detect proxy behavior
function getProxyBehavior(): string {
  try {
    const target = { a: 1 };
    const handler = {
      get(obj: any, prop: string) {
        if (prop === "a") return 999; // unnatural override
        return obj[prop];
      }
    };
    const proxied = new Proxy(target, handler);
    return proxied.a === 999 ? "Proxy override detected" : "Proxy not detectable";
  } catch {
    return "unavailable";
  }
}

// JS engine signature
function getEngineSignature(): string {
  try {
    const fn = function NamedFuncExample(x: number, y: number) { return x + y; };
    const fnStr = fn.toString().replace(/\s+/g, " ");

    const errSig = getErrorSignature();
    const jsonSig = JSON.stringify({ x: 1 });
    const locale = (1.1).toLocaleString();

    return [fnStr, errSig, jsonSig, locale].join(" || ");
  } catch {
    return "unavailable";
  }
}

export function getJavascriptInfo(): FingerprintData[] {
  // Window keys
  const windowKeys = safeKeys(window);
  const navigatorKeys = safeKeys(navigator);
  const elementKeys = safeKeys(HTMLElement.prototype);

  // Timing: how long it takes to enumerate 10k ownPropertyNames
  const timingBench = measure(() => {
    const tmp = {};
    for (let i = 0; i < 10000; i++) (tmp as any)["k" + i] = i;
    Object.getOwnPropertyNames(tmp);
  });

  const proxyBehavior = getProxyBehavior();
  const errorSig = getErrorSignature();
  const engineSig = getEngineSignature();

  return [
    {
      category: "JavaScript Engine",
      key: "Window Keys",
      value: windowKeys.length.toString(),
      tooltip: "Count of own properties on window object (high entropy)."
    },
    {
      category: "JavaScript Engine",
      key: "Navigator Keys",
      value: navigatorKeys.length.toString(),
      tooltip: "Count of own properties on navigator (browser-dependent)."
    },
    {
      category: "JavaScript Engine",
      key: "HTMLElement Prototype Keys",
      value: elementKeys.length.toString(),
      tooltip: "HTMLElement.prototype keys reveal engine/browser version."
    },
    {
      category: "JavaScript Engine",
      key: "Property Enumeration Timing",
      value: timingBench.toFixed(2) + " ms",
      tooltip: "Timing for large Object.getOwnPropertyNames call (JIT-dependent)."
    },
    {
      category: "JavaScript Engine",
      key: "Proxy Behavior",
      value: proxyBehavior,
      tooltip: "Checking if Proxy traps alter observable behavior."
    },
    {
      category: "JavaScript Engine",
      key: "Error Stack Signature",
      value: errorSig.slice(0, 120) + "...",
      tooltip: "Error stack formatting reveals JS engine (V8/SpiderMonkey/WebKit)."
    },
    {
      category: "JavaScript Engine",
      key: "Engine Signature",
      value: engineSig.slice(0, 150) + "...",
      tooltip: "Composite JS engine fingerprint derived from functions, errors, JSON, and locale formatting."
    }
  ];
}
