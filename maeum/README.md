# 마음 꺼내기 연습

내 마음을 말로 꺼내는 연습과 기록을 돕는 웹 앱. 상담 종결 이후 혼자 이어가는 용도.

기록은 서버로 전송되지 않고 **사용자 기기의 브라우저 저장소(localStorage)에만** 저장된다.

## GitHub Pages에 올리기

1. 새 저장소를 만든다 (예: `maeum-practice`). **Public**이어야 Pages가 무료로 동작한다.
2. 이 폴더의 파일을 저장소 **최상위**에 올린다. (`index.html`이 루트에 있어야 한다.)
3. 저장소 → **Settings → Pages** → Source를 **Deploy from a branch**, 브랜치 `main` / 폴더 `/ (root)`로 설정하고 저장.
4. 1~2분 뒤 `https://<계정명>.github.io/maeum-practice/` 로 열린다.

모든 경로가 상대 경로(`./`)라서 저장소 이름이 무엇이든, 하위 경로로 서비스되어도 그대로 동작한다.

## 파일

| 파일 | 역할 |
|---|---|
| `index.html` | 앱 전체 (HTML·CSS·JS 한 파일) |
| `manifest.webmanifest` | 홈 화면 추가용 설정 |
| `sw.js` | 오프라인 지원 (네트워크 우선, 실패 시 캐시) |
| `icon-192.png` / `icon-512.png` | 앱 아이콘 |
| `icon-maskable-512.png` | 안드로이드 적응형 아이콘 |
| `apple-touch-icon.png` | iOS 홈 화면 아이콘 |
| `.nojekyll` | GitHub Pages의 Jekyll 처리 건너뛰기 |

## 수정하고 다시 올릴 때

`index.html`만 교체하면 된다. 내용을 크게 바꿨다면 `sw.js`의 `CACHE` 값을 `maeum-v2`처럼 올려서 기존 캐시를 확실히 비운다. 서비스 워커가 네트워크 우선이라, 인터넷이 연결된 상태에서 열면 최신판을 받는다.

**주의**: 저장 구조(localStorage 키 `maeum.v1.*`)를 바꾸면 사용자의 기존 기록이 보이지 않게 된다. 키 이름은 그대로 두는 편이 안전하다.
