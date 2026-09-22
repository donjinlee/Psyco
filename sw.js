/* 마음 꺼내기 연습 — 오프라인 지원용 서비스 워커
   전략: 네트워크 우선, 실패하면 캐시.
   앱을 수정해서 다시 올리면 인터넷이 연결된 상태에서 자동으로 최신판을 받습니다. */

var CACHE = 'maeum-v1';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .catch(function () {})
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          return k === CACHE ? null : caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  // 같은 주소의 파일만 다룬다 (웹폰트 등 외부 요청은 그냥 통과)
  try {
    if (new URL(req.url).origin !== self.location.origin) return;
  } catch (err) { return; }

  e.respondWith(
    fetch(req)
      .then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('./index.html');
        });
      })
  );
});
