/* 인지재구조화 생각 기록지 — 오프라인 지원 서비스 워커
 *
 * 같은 저장소에 여러 앱이 있으므로, 이 워커는 철저히 자기 것만 다룹니다.
 *  - 캐시 정리: 이름이 'thought-record-'로 시작하는 자기 캐시만 지웁니다.
 *  - 요청 가로채기: 자기 페이지 요청만 처리하고, 나머지는 손대지 않고 통과시킵니다.
 *  - 전략: 네트워크 우선, 실패하면 캐시 (온라인이면 항상 최신판).
 */

var CACHE = 'thought-record-v2';
var PAGE = 'thought-record-app.html';
var ASSETS = ['./' + PAGE];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .catch(function () {})
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.map(function (k) {
          // 다른 앱의 캐시는 절대 건드리지 않는다
          if (k.indexOf('thought-record-') === 0 && k !== CACHE) return caches.delete(k);
          return null;
        }));
      })
      .then(function () { return self.clients.claim(); })
      .catch(function () {})
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.origin !== self.location.origin) return;           // 웹폰트 등 외부 요청은 통과

  var isOwnPage = url.pathname.slice(-PAGE.length) === PAGE;
  if (!isOwnPage) return;                                    // 다른 앱 요청은 통과

  e.respondWith(
    fetch(req)
      .then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); }).catch(function () {});
        return res;
      })
      .catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match('./' + PAGE);
        });
      })
  );
});
