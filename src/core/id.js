/**
 * Create a browser-safe UUID-like string without relying on randomUUID.
 * This uses getRandomValues when available and falls back gracefully.
 */
const randomNibble = () => {
  const cryptoApi = globalThis.crypto

  if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') {
    const buffer = new Uint8Array(1)
    cryptoApi.getRandomValues(buffer)
    return buffer[0] & 15
  }

  return Math.floor(Math.random() * 16)
}

export const createId = () => {
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'

  return template.replace(/[xy]/g, char => {
    const value = randomNibble()
    const nextValue = char === 'x' ? value : ((value & 3) | 8)
    return nextValue.toString(16)
  })
}
