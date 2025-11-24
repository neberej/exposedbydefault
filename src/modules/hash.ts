
export function murmurhash3(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 3432918353) | 0;
    h = (h << 13) | (h >>> 19);
  }
  h = Math.imul(h ^ (h >>> 16), 2246822507) | 0;
  h = Math.imul(h ^ (h >>> 13), 3266489909) | 0;
  return ((h ^ (h >>> 16)) >>> 0).toString(16).padStart(8, '0');
}
