import type { Country } from '../types';

// 설명 문장은 초등 저학년 어휘, 1~2문장을 기준으로 씁니다.
// highlight(4번째 탭): 아주 유명한 전통 의상이 있으면 의상, 없으면 그 나라를 대표하는 동물이나 음악.
export const countries: Country[] = [
  // ───────── 아시아 ─────────
  {
    id: 'korea', continentId: 'asia', nameKo: '대한민국', nameEn: 'South Korea', iso: 'kr', pin: [127.8, 36.4],
    greeting: { native: '안녕하세요', pronunciationKo: '안녕하세요', meaningKo: '만났을 때 하는 인사예요', how: '어른께는 허리를 숙여 공손하게 인사해요.', lang: 'ko-KR' },
    food: { name: '비빔밥', description: '밥 위에 여러 가지 나물과 고기, 달걀을 올리고 고추장과 함께 쓱쓱 비벼 먹어요.' },
    landmark: { name: '경복궁 근정전', description: '옛날 조선의 왕이 살던 궁궐이에요. 근정전에서는 나라의 큰 행사가 열렸어요.' },
    highlight: { kind: 'costume', name: '한복', description: '명절이나 특별한 날에 입는 옷이에요. 고운 색깔과 넉넉한 치마가 특징이에요.' },
  },
  {
    id: 'japan', continentId: 'asia', nameKo: '일본', nameEn: 'Japan', iso: 'jp', pin: [138.4, 36.3],
    greeting: { native: 'こんにちは', pronunciationKo: '곤니치와', meaningKo: '안녕하세요', how: '고개를 살짝 숙이며 인사해요.', lang: 'ja-JP' },
    food: { name: '초밥', description: '식초로 맛을 낸 밥 위에 생선이나 달걀을 올린 음식이에요.' },
    landmark: { name: '히메지성', description: '하얀 성이 날개를 편 백로처럼 보여서 "백로성"이라고도 불러요.' },
    highlight: { kind: 'costume', name: '기모노', description: '축제나 특별한 날에 입는 긴 옷이에요. 허리에 넓은 띠 "오비"를 둘러요.' },
  },
  {
    id: 'china', continentId: 'asia', nameKo: '중국', nameEn: 'China', iso: 'cn', pin: [103, 34],
    greeting: { native: '你好', pronunciationKo: '니하오', meaningKo: '안녕하세요', how: '웃으며 가볍게 고개를 끄덕여요.', lang: 'zh-CN' },
    food: { name: '만두 (자오쯔)', description: '밀가루 피에 고기와 채소를 넣어 빚은 음식이에요. 설날에 가족이 함께 빚어 먹어요.' },
    landmark: { name: '만리장성', description: '아주 먼 옛날에 쌓은 엄청나게 긴 성벽이에요. 산을 따라 구불구불 이어져 있어요.' },
    highlight: { kind: 'animal', name: '판다', description: '중국의 대나무 숲에 사는 곰이에요. 하루에 10시간 넘게 대나무를 먹어요.' },
  },
  {
    id: 'india', continentId: 'asia', nameKo: '인도', nameEn: 'India', iso: 'in', pin: [78.5, 22],
    greeting: { native: 'नमस्ते', pronunciationKo: '나마스테', meaningKo: '안녕하세요', how: '두 손을 가슴 앞에 모으고 고개를 숙여요.', lang: 'hi-IN' },
    food: { name: '난', description: '화덕 벽에 붙여 구운 납작한 빵이에요. 카레에 찍어 먹어요.' },
    landmark: { name: '타지마할', description: '하얀 대리석으로 지은 아름다운 건물이에요. 왕이 사랑하는 왕비를 기리며 지었어요.' },
    highlight: { kind: 'costume', name: '사리', description: '길고 커다란 천 한 장을 몸에 감아서 입는 옷이에요.' },
  },
  {
    id: 'thailand', continentId: 'asia', nameKo: '태국', nameEn: 'Thailand', iso: 'th', pin: [100.6, 15.6],
    greeting: { native: 'สวัสดี', pronunciationKo: '사왓디', meaningKo: '안녕하세요', how: '두 손을 모으고 고개를 숙이는 "와이"로 인사해요.', lang: 'th-TH' },
    food: { name: '팟타이', description: '쌀국수를 새우, 숙주, 땅콩과 함께 볶은 음식이에요.' },
    landmark: { name: '왓 아룬', description: '"새벽 사원"이라는 뜻이에요. 탑이 알록달록한 도자기 조각으로 꾸며져 있어요.' },
    highlight: { kind: 'animal', name: '코끼리', description: '태국을 대표하는 동물이에요. 긴 코로 물을 뿌리고 무거운 통나무도 들어 올려요.' },
  },
  {
    id: 'vietnam', continentId: 'asia', nameKo: '베트남', nameEn: 'Vietnam', iso: 'vn', pin: [108.2, 14.2],
    greeting: { native: 'Xin chào', pronunciationKo: '신짜오', meaningKo: '안녕하세요', how: '웃으며 고개를 살짝 숙여요.', lang: 'vi-VN' },
    food: { name: '쌀국수 (퍼)', description: '맑고 따뜻한 국물에 쌀국수와 고기, 향긋한 풀을 넣어 먹어요.' },
    landmark: { name: '호이안 내원교', description: '지붕이 있는 오래된 다리예요. 400년쯤 전에 지어졌어요.' },
    highlight: { kind: 'costume', name: '아오자이', description: '긴 윗옷과 바지를 함께 입는 옷이에요. 학생들이 교복으로 입기도 해요.' },
  },

  // ───────── 유럽 ─────────
  {
    id: 'france', continentId: 'europe', nameKo: '프랑스', nameEn: 'France', iso: 'fr', pin: [2.4, 46.6],
    greeting: { native: 'Bonjour', pronunciationKo: '봉주르', meaningKo: '안녕하세요', how: '친한 사이에는 양쪽 볼을 살짝 맞대며 인사해요.', lang: 'fr-FR' },
    food: { name: '크루아상', description: '버터를 넣은 반죽을 여러 겹 접어 구운 초승달 모양 빵이에요.' },
    landmark: { name: '에펠탑', description: '쇠로 만든 아주 높은 탑이에요. 밤이 되면 반짝반짝 불빛이 켜져요.' },
    highlight: { kind: 'animal', name: '수탉', description: '프랑스를 상징하는 동물이에요. 축구 대표팀 유니폼에도 수탉이 그려져 있어요.' },
  },
  {
    id: 'uk', continentId: 'europe', nameKo: '영국', nameEn: 'United Kingdom', iso: 'gb', pin: [-1.8, 53],
    greeting: { native: 'Hello', pronunciationKo: '헬로', meaningKo: '안녕하세요', how: '눈을 맞추고 악수를 해요.', lang: 'en-GB' },
    food: { name: '피시 앤드 칩스', description: '바삭하게 튀긴 생선과 감자튀김이에요.' },
    landmark: { name: '빅벤', description: '국회의사당 옆 커다란 시계탑이에요. "빅벤"은 탑 안에 있는 큰 종의 이름이에요.' },
    highlight: { kind: 'costume', name: '근위병 제복', description: '왕궁을 지키는 근위병은 빨간 옷을 입고 높고 까만 털모자를 써요.' },
  },
  {
    id: 'italy', continentId: 'europe', nameKo: '이탈리아', nameEn: 'Italy', iso: 'it', pin: [12.6, 42.6],
    greeting: { native: 'Ciao', pronunciationKo: '차오', meaningKo: '안녕 (만날 때도 헤어질 때도 써요)', how: '친한 사이에는 볼을 맞대며 인사해요.', lang: 'it-IT' },
    food: { name: '피자', description: '둥글고 얇은 빵 위에 토마토와 치즈를 올려 화덕에 구워요.' },
    landmark: { name: '콜로세움', description: '약 2000년 전에 지은 거대한 원형 경기장이에요.' },
    highlight: { kind: 'costume', name: '베네치아 카니발 가면', description: '베네치아 축제 때는 화려한 가면과 옷으로 변장하고 거리를 다녀요.' },
  },
  {
    id: 'germany', continentId: 'europe', nameKo: '독일', nameEn: 'Germany', iso: 'de', pin: [10.4, 51],
    greeting: { native: 'Hallo', pronunciationKo: '할로', meaningKo: '안녕하세요', how: '악수를 하며 인사해요.', lang: 'de-DE' },
    food: { name: '프레첼', description: '매듭 모양으로 꼰 빵이에요. 겉에 굵은 소금이 뿌려져 있어요.' },
    landmark: { name: '노이슈반슈타인성', description: '숲속 언덕 위에 있는 동화 속 같은 성이에요.' },
    highlight: { kind: 'costume', name: '디른들과 레더호젠', description: '축제 때 여자는 앞치마 달린 원피스 "디른들", 남자는 가죽 반바지 "레더호젠"을 입어요.' },
  },
  {
    id: 'spain', continentId: 'europe', nameKo: '스페인', nameEn: 'Spain', iso: 'es', pin: [-3.7, 40],
    greeting: { native: 'Hola', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '친한 사이에는 양쪽 볼을 맞대요.', lang: 'es-ES' },
    food: { name: '파에야', description: '커다란 팬에 쌀과 해산물, 채소를 넣고 노랗게 익힌 음식이에요.' },
    landmark: { name: '사그라다 파밀리아', description: '140년 넘게 아직도 짓고 있는 성당이에요. 옥수수처럼 생긴 탑들이 있어요.' },
    highlight: { kind: 'costume', name: '플라멩코 드레스', description: '플라멩코 춤을 출 때 입는 드레스예요. 치맛단에 주름이 풍성해요.' },
  },
  {
    id: 'greece', continentId: 'europe', nameKo: '그리스', nameEn: 'Greece', iso: 'gr', pin: [22, 39.4],
    greeting: { native: 'Γειά σου', pronunciationKo: '야수', meaningKo: '안녕', how: '웃으며 인사하고 악수해요.', lang: 'el-GR' },
    food: { name: '수블라키', description: '고기를 꼬치에 꽂아 구운 음식이에요.' },
    landmark: { name: '파르테논 신전', description: '약 2500년 전 언덕 위에 지은 신전이에요. 커다란 돌기둥이 줄지어 서 있어요.' },
    highlight: { kind: 'costume', name: '에브조네스 근위병', description: '대통령 궁을 지키는 근위병이에요. 주름 많은 하얀 치마를 입고 방울 달린 신발을 신어요.' },
  },

  // ───────── 아프리카 ─────────
  {
    id: 'egypt', continentId: 'africa', nameKo: '이집트', nameEn: 'Egypt', iso: 'eg', pin: [30, 26.5],
    greeting: { native: 'أهلاً', pronunciationKo: '아흘란', meaningKo: '환영해요, 안녕하세요', how: '오른손으로 악수하며 인사해요.', lang: 'ar-EG' },
    food: { name: '코샤리', description: '쌀, 마카로니, 렌틸콩을 섞고 토마토 소스와 바삭한 양파를 올려 먹어요.' },
    landmark: { name: '기자의 피라미드', description: '약 4500년 전에 왕의 무덤으로 지은 거대한 돌 건축물이에요.' },
    highlight: { kind: 'animal', name: '낙타', description: '뜨거운 사막을 잘 걷는 동물이에요. 등에 있는 혹에 지방을 저장해서 오래 버텨요.' },
  },
  {
    id: 'kenya', continentId: 'africa', nameKo: '케냐', nameEn: 'Kenya', iso: 'ke', pin: [37.9, 0.4],
    greeting: { native: 'Jambo', pronunciationKo: '잠보', meaningKo: '안녕하세요', how: '스와힐리어로 인사하며 악수해요.', lang: 'sw-KE' },
    food: { name: '우갈리', description: '옥수수 가루를 되직하게 익힌 음식이에요. 손으로 떼어 채소와 함께 먹어요.' },
    landmark: { name: '라무 옛 시가지', description: '바닷가에 있는 오래된 마을이에요. 좁은 골목에서는 차 대신 당나귀가 다녀요.' },
    highlight: { kind: 'costume', name: '마사이족 슈카', description: '마사이족은 빨간 천 "슈카"를 두르고, 알록달록한 구슬 장신구를 해요.' },
  },
  {
    id: 'south-africa', continentId: 'africa', nameKo: '남아프리카공화국', nameEn: 'South Africa', iso: 'za', pin: [24.5, -30],
    greeting: { native: 'Sawubona', pronunciationKo: '사우보나', meaningKo: '안녕하세요 ("당신을 보고 있어요"라는 뜻)', how: '줄루어 인사예요. 악수하며 인사해요.', lang: 'zu-ZA' },
    food: { name: '브라이', description: '불 위에 고기와 둘둘 말린 소시지 "부르보스"를 구워 먹는 바비큐예요.' },
    landmark: { name: '보캅 마을', description: '케이프타운에 있는 마을이에요. 집들이 무지개처럼 알록달록해요.' },
    highlight: { kind: 'animal', name: '아프리카펭귄', description: '아프리카에도 펭귄이 살아요! 바닷가 모래밭에서 무리 지어 살아요.' },
  },
  {
    id: 'morocco', continentId: 'africa', nameKo: '모로코', nameEn: 'Morocco', iso: 'ma', pin: [-6.5, 32],
    greeting: { native: 'سلام', pronunciationKo: '살람', meaningKo: '"평화"라는 뜻의 인사예요', how: '오른손을 가슴에 얹으며 인사하기도 해요.', lang: 'ar-MA' },
    food: { name: '타진', description: '뾰족한 뚜껑이 있는 그릇에 고기와 채소를 넣고 천천히 익힌 음식이에요.' },
    landmark: { name: '하산 2세 모스크', description: '바다 바로 옆에 지은 커다란 이슬람 사원이에요. 탑의 높이가 200미터가 넘어요.' },
    highlight: { kind: 'animal', name: '바바리마카크', description: '모로코의 아틀라스 산맥에 사는 원숭이예요. 꼬리가 거의 없어요.' },
  },
  {
    id: 'nigeria', continentId: 'africa', nameKo: '나이지리아', nameEn: 'Nigeria', iso: 'ng', pin: [8, 9.6],
    greeting: { native: 'Sannu', pronunciationKo: '산누', meaningKo: '안녕하세요', how: '하우사어 인사예요. 나이지리아에는 500개가 넘는 언어가 있어요.', lang: 'ha-NG' },
    food: { name: '졸로프 라이스', description: '토마토와 고추로 빨갛게 양념한 밥이에요.' },
    landmark: { name: '아부자 국립 모스크', description: '수도 아부자에 있는 금빛 둥근 지붕의 큰 이슬람 사원이에요.' },
    highlight: { kind: 'music', name: '토킹 드럼', description: '"말하는 북"이라는 뜻이에요. 줄을 조였다 풀었다 하며 사람 목소리처럼 소리를 내요.' },
  },

  // ───────── 북아메리카 ─────────
  {
    id: 'usa', continentId: 'north-america', nameKo: '미국', nameEn: 'United States', iso: 'us', pin: [-98.5, 39],
    greeting: { native: 'Hello', pronunciationKo: '헬로', meaningKo: '안녕하세요', how: '"Hi!" 하고 가볍게 손을 흔들기도 해요.', lang: 'en-US' },
    food: { name: '햄버거', description: '둥근 빵 사이에 고기 패티와 채소를 넣은 음식이에요.' },
    landmark: { name: '자유의 여신상', description: '횃불을 높이 든 커다란 동상이에요. 프랑스가 미국에 선물했어요.' },
    highlight: { kind: 'animal', name: '흰머리수리', description: '미국을 상징하는 새예요. 머리는 하얗고 부리는 노란색이에요.' },
  },
  {
    id: 'canada', continentId: 'north-america', nameKo: '캐나다', nameEn: 'Canada', iso: 'ca', pin: [-106, 57],
    greeting: { native: 'Hello · Bonjour', pronunciationKo: '헬로 · 봉주르', meaningKo: '안녕하세요', how: '캐나다는 영어와 프랑스어를 함께 써요.', lang: 'en-CA', speakText: 'Hello! Bonjour!' },
    food: { name: '메이플 시럽', description: '단풍나무 수액을 끓여 만든 달콤한 시럽이에요. 팬케이크에 뿌려 먹어요.' },
    landmark: { name: 'CN 타워', description: '토론토에 있는 아주 높은 탑이에요. 꼭대기에는 바닥이 유리로 된 전망대가 있어요.' },
    highlight: { kind: 'animal', name: '비버', description: '캐나다를 상징하는 동물이에요. 튼튼한 이빨로 나무를 갉아 물 위에 집을 지어요.' },
  },
  {
    id: 'mexico', continentId: 'north-america', nameKo: '멕시코', nameEn: 'Mexico', iso: 'mx', pin: [-102, 23.6],
    greeting: { native: 'Hola', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '친한 사이에는 볼을 맞대며 인사해요.', lang: 'es-MX' },
    food: { name: '타코', description: '옥수수로 만든 얇고 둥근 빵 "토르티야"에 고기와 채소를 싸 먹어요.' },
    landmark: { name: '치첸이트사', description: '옛날 마야 사람들이 지은 계단 모양 피라미드예요.' },
    highlight: { kind: 'music', name: '마리아치', description: '바이올린, 기타, 트럼펫으로 함께 연주하는 멕시코 음악이에요. 연주자들은 멋진 전통 옷을 입어요.' },
  },
  {
    id: 'cuba', continentId: 'north-america', nameKo: '쿠바', nameEn: 'Cuba', iso: 'cu', pin: [-79, 21.7],
    greeting: { native: 'Hola', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '쿠바도 스페인어를 써요. 볼을 맞대며 인사해요.', lang: 'es-CU' },
    food: { name: '아로스 콘 포요', description: '노랗게 물들인 밥과 닭고기를 함께 익힌 음식이에요.' },
    landmark: { name: '카피톨리오', description: '수도 아바나에 있는 둥근 지붕의 큰 건물이에요. 거리에는 옛날 자동차들이 달려요.' },
    highlight: { kind: 'animal', name: '꿀벌벌새', description: '세상에서 가장 작은 새예요. 크기가 꿀벌만 해서 이런 이름이 붙었어요.' },
  },

  // ───────── 남아메리카 ─────────
  {
    id: 'brazil', continentId: 'south-america', nameKo: '브라질', nameEn: 'Brazil', iso: 'br', pin: [-51, -10],
    greeting: { native: 'Olá', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '브라질은 포르투갈어를 써요. 볼을 맞대며 인사해요.', lang: 'pt-BR' },
    food: { name: '슈하스코', description: '커다란 꼬치에 고기를 꽂아 불에 구운 음식이에요.' },
    landmark: { name: '구세주 그리스도상', description: '리우데자네이루 산꼭대기에 두 팔을 벌리고 서 있는 거대한 동상이에요.' },
    highlight: { kind: 'costume', name: '삼바 카니발 의상', description: '카니발 축제 때는 반짝이와 깃털로 꾸민 화려한 옷을 입고 삼바 춤을 춰요.' },
  },
  {
    id: 'argentina', continentId: 'south-america', nameKo: '아르헨티나', nameEn: 'Argentina', iso: 'ar', pin: [-64.5, -35],
    greeting: { native: 'Hola', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '볼을 한 번 맞대며 인사해요.', lang: 'es-AR' },
    food: { name: '아사도', description: '고기와 소시지를 숯불에 천천히 구워 먹어요. 가족과 친구들이 모이면 꼭 먹어요.' },
    landmark: { name: '오벨리스코', description: '수도 부에노스아이레스 한가운데 서 있는 하얗고 뾰족한 탑이에요.' },
    highlight: { kind: 'music', name: '탱고', description: '아르헨티나에서 태어난 음악과 춤이에요. 두 사람이 꼭 붙어 멋지게 춤을 춰요.' },
  },
  {
    id: 'peru', continentId: 'south-america', nameKo: '페루', nameEn: 'Peru', iso: 'pe', pin: [-75, -9.5],
    greeting: { native: 'Hola', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '안데스 산에 사는 사람들은 케추아어로 인사하기도 해요.', lang: 'es-PE' },
    food: { name: '세비체', description: '싱싱한 생선을 라임즙에 재워 새콤하게 만든 음식이에요.' },
    landmark: { name: '마추픽추', description: '높은 산 위에 잉카 사람들이 돌로 지은 마을이에요.' },
    highlight: { kind: 'animal', name: '라마', description: '안데스 산에 사는 털복숭이 동물이에요. 무거운 짐을 등에 지고 산길을 걸어요.' },
  },
  {
    id: 'chile', continentId: 'south-america', nameKo: '칠레', nameEn: 'Chile', iso: 'cl', pin: [-70.8, -28],
    greeting: { native: 'Hola', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '볼을 한 번 맞대며 인사해요.', lang: 'es-CL' },
    food: { name: '엠파나다', description: '반달 모양 반죽 안에 고기나 치즈를 넣고 구운 음식이에요.' },
    landmark: { name: '모아이 석상', description: '이스터섬에 있는 커다란 얼굴 모양 돌 조각상이에요.' },
    highlight: { kind: 'animal', name: '안데스콘도르', description: '하늘을 나는 새 중에서 가장 큰 새 가운데 하나예요. 날개를 펴면 3미터나 돼요.' },
  },
  {
    id: 'colombia', continentId: 'south-america', nameKo: '콜롬비아', nameEn: 'Colombia', iso: 'co', pin: [-73.5, 4],
    greeting: { native: 'Hola', pronunciationKo: '올라', meaningKo: '안녕하세요', how: '악수하거나 볼을 맞대며 인사해요.', lang: 'es-CO' },
    food: { name: '아레파', description: '옥수수 가루로 만든 동글납작한 빵이에요. 치즈를 넣어 먹기도 해요.' },
    landmark: { name: '카르타헤나 옛 시가지', description: '성벽으로 둘러싸인 바닷가 마을이에요. 알록달록한 집과 나무 발코니가 예뻐요.' },
    highlight: { kind: 'music', name: '쿰비아', description: '콜롬비아 바닷가에서 시작된 신나는 음악과 춤이에요. 여자들은 넓은 치마를 흔들며 춤춰요.' },
  },

  // ───────── 오세아니아 ─────────
  {
    id: 'australia', continentId: 'oceania', nameKo: '호주', nameEn: 'Australia', iso: 'au', pin: [134, -25],
    greeting: { native: "G'day", pronunciationKo: '그다이', meaningKo: '안녕하세요 ("좋은 날"이라는 뜻)', how: '"굿 데이"를 줄인 말이에요. 친근하게 인사해요.', lang: 'en-AU' },
    food: { name: '미트파이', description: '작은 파이 안에 다진 고기를 넣어 구운 음식이에요. 토마토소스를 뿌려 먹어요.' },
    landmark: { name: '시드니 오페라하우스', description: '바닷가에 있는 공연장이에요. 지붕이 돛단배의 돛처럼 생겼어요.' },
    highlight: { kind: 'animal', name: '캥거루', description: '호주를 대표하는 동물이에요. 엄마 캥거루는 배 주머니에 아기를 넣고 다녀요.' },
  },
  {
    id: 'new-zealand', continentId: 'oceania', nameKo: '뉴질랜드', nameEn: 'New Zealand', iso: 'nz', pin: [172.6, -42],
    greeting: { native: 'Kia ora', pronunciationKo: '키아 오라', meaningKo: '안녕하세요 ("건강하세요"라는 뜻)', how: '마오리어 인사예요. 코를 맞대는 "홍이"로 인사하기도 해요.', lang: 'mi-NZ' },
    food: { name: '항이', description: '땅을 파고 뜨겁게 달군 돌 위에 음식을 넣어 익히는 마오리 전통 요리예요.' },
    landmark: { name: '스카이 타워', description: '오클랜드에 있는 아주 높은 탑이에요. 꼭대기에서 도시가 한눈에 보여요.' },
    highlight: { kind: 'animal', name: '키위', description: '뉴질랜드에만 사는 새예요. 날개가 아주 작아서 날지 못해요.' },
  },
  {
    id: 'fiji', continentId: 'oceania', nameKo: '피지', nameEn: 'Fiji', iso: 'fj', pin: [178.1, -17.8],
    greeting: { native: 'Bula', pronunciationKo: '불라', meaningKo: '안녕하세요', how: '아주 밝고 크게 "불라!" 하고 인사해요.', lang: 'fj-FJ' },
    food: { name: '코코다', description: '생선을 라임즙에 재운 뒤 코코넛 밀크를 부어 먹는 음식이에요.' },
    landmark: { name: '부레', description: '나무와 풀로 지은 피지 전통 집이에요. 뾰족한 지붕이 풀로 덮여 있어요.' },
    highlight: { kind: 'animal', name: '피지 이구아나', description: '피지의 섬에만 사는 초록색 도마뱀이에요. 놀라면 몸 색깔이 어두워져요.' },
  },
];

export const countryById: Record<string, Country> = Object.fromEntries(countries.map((c) => [c.id, c]));
