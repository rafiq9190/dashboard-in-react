/**
 * Deterministic pseudo-random helpers for demo/placeholder chart data.
 *
 * `Math.random()` must not be called during render: React may re-render a
 * component at any time, and the values would change on every pass. These
 * helpers derive stable values from a string seed instead, so the same seed
 * always yields the same series.
 */

/** Hash a string into a 32-bit unsigned integer (FNV-1a). */
export function hashSeed(seed: string): number {
  let hash = 0x811c9dc5
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

/**
 * Create a seeded generator (mulberry32). Each call to the returned function
 * yields the next number in [0, 1), and the sequence is identical for a given
 * seed.
 */
export function createSeededRandom(seed: string | number) {
  let state = (typeof seed === 'number' ? seed : hashSeed(seed)) >>> 0
  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
