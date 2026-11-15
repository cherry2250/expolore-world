// 탭과 버튼에 쓰는 단순한 아이콘. 색은 currentColor를 따릅니다.
type P = { size?: number };

export const BackIcon = ({ size = 32 }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M20 6 L10 16 L20 26" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const NextIcon = ({ size = 32 }: P) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M12 6 L22 16 L12 26" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CloseIcon = ({ size = 28 }: P) => (
  <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
    <path d="M7 7 L21 21 M21 7 L7 21" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const SpeakerIcon = ({ size = 32, off = false }: P & { off?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M5 12 h5 l7 -6 v20 l-7 -6 h-5z" fill="currentColor" />
    {off ? (
      <path d="M22 12 l7 8 M29 12 l-7 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    ) : (
      <path d="M21 11 q4 5 0 10 M25 7 q8 9 0 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    )}
  </svg>
);

export const GreetingIcon = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M8 6 h24 a5 5 0 0 1 5 5 v12 a5 5 0 0 1 -5 5 h-13 l-7 6 v-6 h-4 a5 5 0 0 1 -5 -5 v-12 a5 5 0 0 1 5 -5z" fill="currentColor" />
    <circle cx="13" cy="17" r="2.2" fill="var(--icon-cut, #fff)" />
    <circle cx="20" cy="17" r="2.2" fill="var(--icon-cut, #fff)" />
    <circle cx="27" cy="17" r="2.2" fill="var(--icon-cut, #fff)" />
  </svg>
);

export const FoodIcon = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M4 20 h32 a16 14 0 0 1 -32 0z" fill="currentColor" />
    <path d="M14 15 q-3 -4 0 -8 M20 15 q-3 -4 0 -8 M26 15 q-3 -4 0 -8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
  </svg>
);

export const LandmarkIcon = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M20 3 L37 14 H3 Z" fill="currentColor" />
    <rect x="6" y="16" width="5" height="15" rx="1" fill="currentColor" />
    <rect x="17.5" y="16" width="5" height="15" rx="1" fill="currentColor" />
    <rect x="29" y="16" width="5" height="15" rx="1" fill="currentColor" />
    <rect x="3" y="32" width="34" height="5" rx="1.5" fill="currentColor" />
  </svg>
);

export const CostumeIcon = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M14 4 L3 10 l5 9 4 -2 v19 h16 v-19 l4 2 5 -9 -11 -6 q-3 5 -6 5 q-3 0 -6 -5z" fill="currentColor" />
  </svg>
);

export const AnimalIcon = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <ellipse cx="20" cy="27" rx="9" ry="8" fill="currentColor" />
    <ellipse cx="9" cy="17" rx="4" ry="5" fill="currentColor" />
    <ellipse cx="31" cy="17" rx="4" ry="5" fill="currentColor" />
    <ellipse cx="15" cy="9" rx="3.6" ry="4.6" fill="currentColor" />
    <ellipse cx="25" cy="9" rx="3.6" ry="4.6" fill="currentColor" />
  </svg>
);

export const MusicIcon = ({ size = 40 }: P) => (
  <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
    <path d="M15 8 L34 4 V27" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M15 8 V31" stroke="currentColor" strokeWidth="4" />
    <ellipse cx="10" cy="31" rx="6" ry="5" fill="currentColor" />
    <ellipse cx="29" cy="27" rx="6" ry="5" fill="currentColor" />
  </svg>
);
