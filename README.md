# 지구마을 탐험대

태블릿용 어린이 세계 문화 탐험 웹앱. 세계 지도 → 대륙 → 나라(인사·음식·명소·의상/동물/음악) 3단계로 탐험합니다.

4번째 탭은 나라마다 다릅니다. 아주 유명한 전통 의상이 있으면 **의상**, 없으면 그 나라를 대표하는 **동물**이나 **음악**을 보여 줍니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:5173 (같은 와이파이의 태블릿에서도 접속 가능)
npm test         # 콘텐츠 데이터 검증 (사진·출처 누락, 핀 위치)
npm run build    # dist/ 에 정적 파일 생성
```

## 배포

- **Netlify**: 저장소를 연결하면 `netlify.toml` 설정대로 `npm run build` → `dist` 배포.
- **GitHub Pages**: `npm run build` 후 `dist/` 를 Pages로 배포. 해시 주소(`#/asia/japan`)와 상대 경로(`base: './'`)를 써서 하위 경로에서도 별도 설정 없이 동작합니다.

## 구조

| 경로 | 내용 |
|---|---|
| `src/data/countries.ts` | 29개국 콘텐츠 (인사, 음식·명소·highlight(의상/동물/음악) 이름과 설명, 지도 핀 위치) |
| `src/data/continents.ts` | 대륙 색, 대륙 화면 범위, 나라 순서 |
| `src/data/geo/world.topo.json` | Natural Earth 1:50m 국경 (`npm run geo` 로 다시 생성) |
| `scripts/image-sources.json` | 나라·칸마다 사용할 Wikimedia Commons 파일 이름 |
| `src/data/credits.json` | 사진 저작자·라이선스 (`npm run images` 가 기록) |
| `public/images/<나라>/<food|landmark|highlight>.jpg` | 모두 800×600으로 맞춘 사진 |
| `src/screens/` | 세계 지도, 대륙 화면, 사진 출처 화면 |
| `src/components/CountryModal.tsx` | 나라 모달 |

## 나라 추가하기

1. `src/data/countries.ts` 에 항목 추가, `continents.ts` 의 `countryIds` 에 id 추가
2. `scripts/image-sources.json` 에 Commons 파일 이름(`"File:…jpg"`) 또는 위키백과 문서 제목을 적기
3. `npm run images` → 원본을 `.image-cache/` 에 받고 800×600으로 변환해 `public/images/` 에 저장
   (가로 사진은 중요한 부분 중심으로 4:3 자르기, 세로 사진은 잘리지 않게 넣고 남는 곳은 흐린 배경)
4. `npm test` 로 누락·규격·설명 길이(60자 이하) 확인

## 라이선스 메모

사진은 CC BY / CC BY-SA 등 자유 라이선스이며, 모달 안 사진 아래와 "사진 출처" 화면에 저작자·라이선스를 표시합니다.
