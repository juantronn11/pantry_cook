// SCRUM-42: Wraps a promise with a timeout that rejects if the
// promise does not resolve within the specified time limit.
// Used to prevent the app from hanging indefinitely if an
// external API stops responding.
//
// Usage:
//   withTimeout(fetch('...'), 30000)
//   // rejects with an error after 30 seconds if fetch hasn't resolved

export function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Request timed out after ${ms / 1000} seconds`)), ms)
  )
  return Promise.race([promise, timeout])
}
