const CACHE_NAME = "painel-mestre-ingles-v173";
const ASSETS = [
  "./index.html",
  "./pm.css",
  "./pm-01-base.js",
  "./pm-02-verbos.js",
  "./pm-03-wh-dials.js",
  "./pm-04-lexico.js",
  "./pm-05-geografia.js",
  "./pm-06-oracoes.js",
  "./pm-07-modais.js",
  "./pm-08-treino.js",
  "./data-adjetivos.js",
  "./pm-09-expressoes.js",
  "./pm-10-glossario.js",
  "./pm-11-reduzidas.js",
  "./pm-12-relativas.js",
  "./data-trilha.js",
  "./pm-13-trilha-estruturas.js",
  "./pm-14-menu.js",
  "./expressoes.js",
  "./ipa.js",
  "./ipa-uk.js",
  "./inter-latin-wght-normal.woff2",
  "./jetbrains-mono-latin-wght-normal.woff2",
  "./space-grotesk-latin-wght-normal.woff2",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && res.type === "basic") {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
