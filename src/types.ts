export type ContinentId = 'asia' | 'europe' | 'africa' | 'north-america' | 'south-america' | 'oceania';

export type CultureKind = 'food' | 'landmark' | 'highlight';

/** 4번째 탭의 종류 */
export type HighlightKind = 'costume' | 'animal' | 'music';

/** [경도, 위도] */
export type LonLat = [number, number];

export interface Continent {
  id: ContinentId;
  nameKo: string;
  /** Natural Earth 데이터의 CONTINENT 값 */
  neName: string;
  color: string;
  /** 대륙 화면에서 강조하지 않는 나라의 색 */
  soft: string;
  /** 대륙 화면에 꼭 들어와야 하는 범위 [서, 남, 동, 북] */
  bounds: [number, number, number, number];
  /** 세계 지도에서 이름표 위치 */
  labelAt: LonLat;
  /** 표시 순서 = 모달의 이전/다음 순서 */
  countryIds: string[];
}

export interface CultureItem {
  name: string;
  description: string;
}

export interface Highlight extends CultureItem {
  kind: HighlightKind;
}

export interface Greeting {
  native: string;
  pronunciationKo: string;
  meaningKo: string;
  how: string;
  /** Web Speech 언어 코드 */
  lang: string;
  /** 현지 글자 대신 읽을 문장 (예: "Hello! Bonjour!") */
  speakText?: string;
}

export interface Country {
  id: string;
  continentId: ContinentId;
  nameKo: string;
  nameEn: string;
  /** ISO 3166-1 alpha-2 (소문자) — 국기, 지도 데이터 매칭에 사용 */
  iso: string;
  /** 지도 핀 위치 */
  pin: LonLat;
  greeting: Greeting;
  food: CultureItem;
  landmark: CultureItem;
  /** 아주 유명한 전통 의상이 있으면 의상, 아니면 대표 동물·음악 */
  highlight: Highlight;
}
