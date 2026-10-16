/* ASHA Shiksha offline helper. Keeps the app and fonts on the phone; saves lesson pages as they are opened. */
const CACHE = "asha-24700bfa49";
const CORE = [
 "./",
 "app/",
 "assets/site.css",
 "assets/site.js",
 "assets/app-ads.js",
 "assets/fonts.css",
 "assets/icon-192.png",
 "assets/icon-512.png",
 "manifest.webmanifest",
 "assets/fonts/baloo-2-devanagari-600-normal.woff2",
 "assets/fonts/baloo-2-devanagari-700-normal.woff2",
 "assets/fonts/baloo-2-devanagari-800-normal.woff2",
 "assets/fonts/baloo-2-latin-600-normal.woff2",
 "assets/fonts/baloo-2-latin-700-normal.woff2",
 "assets/fonts/baloo-2-latin-800-normal.woff2",
 "assets/fonts/baloo-bhai-2-gujarati-600-normal.woff2",
 "assets/fonts/baloo-bhai-2-gujarati-700-normal.woff2",
 "assets/fonts/baloo-bhai-2-gujarati-800-normal.woff2",
 "assets/fonts/baloo-bhai-2-latin-600-normal.woff2",
 "assets/fonts/baloo-bhai-2-latin-700-normal.woff2",
 "assets/fonts/baloo-bhai-2-latin-800-normal.woff2",
 "assets/fonts/icons.woff2",
 "assets/fonts/noto-sans-devanagari-400-normal.woff2",
 "assets/fonts/noto-sans-devanagari-600-normal.woff2",
 "assets/fonts/noto-sans-devanagari-700-normal.woff2",
 "assets/fonts/noto-sans-devanagari-devanagari-400-normal.woff2",
 "assets/fonts/noto-sans-devanagari-devanagari-600-normal.woff2",
 "assets/fonts/noto-sans-devanagari-devanagari-700-normal.woff2",
 "assets/fonts/noto-sans-devanagari-latin-400-normal.woff2",
 "assets/fonts/noto-sans-devanagari-latin-600-normal.woff2",
 "assets/fonts/noto-sans-devanagari-latin-700-normal.woff2",
 "assets/fonts/noto-sans-gujarati-gujarati-400-normal.woff2",
 "assets/fonts/noto-sans-gujarati-gujarati-600-normal.woff2",
 "assets/fonts/noto-sans-gujarati-gujarati-700-normal.woff2",
 "assets/fonts/noto-sans-gujarati-latin-400-normal.woff2",
 "assets/fonts/noto-sans-gujarati-latin-600-normal.woff2",
 "assets/fonts/noto-sans-gujarati-latin-700-normal.woff2",
 "assets/fonts/noto-sans-gujarati-math-400-normal.woff2",
 "assets/fonts/noto-sans-gujarati-math-600-normal.woff2",
 "assets/fonts/noto-sans-gujarati-math-700-normal.woff2",
 "assets/fonts/noto-sans-gujarati-symbols-400-normal.woff2",
 "assets/fonts/noto-sans-gujarati-symbols-600-normal.woff2",
 "assets/fonts/noto-sans-gujarati-symbols-700-normal.woff2",
 "assets/fonts/noto-sans-latin-400-normal.woff2",
 "assets/fonts/noto-sans-latin-600-normal.woff2",
 "assets/fonts/noto-sans-latin-700-normal.woff2"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("asha-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // ads and other sites: never cached
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) {
    // pages: try the internet first so updates arrive; fall back to the saved copy when offline
    e.respondWith(fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}).then(r => r || caches.match(new URL("app/", self.location).href))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
