// Lern-Pomodoro web app: works offline and always shows the newest version.
// Pages and version.json: network first (cache only when offline).
// Hashed build files (assets/): cache first, they never change.
const CACHE = 'pomodoro-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  const immutable = url.pathname.includes('/assets/')
  if (immutable) {
    event.respondWith(
      caches.match(request).then((hit) => hit || fetch(request).then((response) => {
        if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((c) => c.put(request, copy)) }
        return response
      })),
    )
    return
  }
  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok && !url.search) { const copy = response.clone(); caches.open(CACHE).then((c) => c.put(request, copy)) }
      return response
    }).catch(() => caches.match(request, { ignoreSearch: true }).then((hit) => hit || caches.match('./index.html'))),
  )
})
