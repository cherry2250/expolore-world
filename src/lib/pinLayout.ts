/**
 * 지도 위 국기 핀이 서로 겹치거나 화면 밖·버튼 밑으로 가지 않도록 위치를 조정합니다.
 * 각 핀은 "국기 원 + 아래 이름표"로 이루어진 사각형으로 보고,
 * 겹치는 핀끼리 덜 겹친 방향으로 밀어내면서 안전 영역 안에 붙잡아 둡니다.
 */
export interface PinInput {
  /** 실제 위치(국기 원의 중심) */
  x: number;
  y: number;
  /** 이름표 폭 (px) */
  labelW: number;
}

export interface PinLayoutOptions {
  flag: number;
  labelH: number;
  /** 핀이 들어가야 하는 영역 */
  safe: { left: number; top: number; right: number; bottom: number };
  /** 핀 사이 최소 간격 */
  gap?: number;
  /** 핀이 피해야 하는 고정 영역 (예: 화면 옆 버튼) */
  obstacles?: { left: number; top: number; right: number; bottom: number }[];
  iterations?: number;
}

export interface PinPlaced {
  x: number;
  y: number;
  /** 원래 위치에서 눈에 띄게 옮겨졌는지 (지시선 표시용) */
  moved: boolean;
}

export function layoutPins(pins: PinInput[], o: PinLayoutOptions): PinPlaced[] {
  const gap = o.gap ?? 6;
  const half = (p: PinInput) => Math.max(o.flag, p.labelW) / 2;
  const up = o.flag / 2;
  const down = o.flag / 2 + o.labelH - 4;
  const pos = pins.map((p) => ({ x: p.x, y: p.y }));

  const clamp = (i: number) => {
    const h = half(pins[i]);
    const { left, right, top, bottom } = o.safe;
    pos[i].x = right - left < 2 * h ? (left + right) / 2 : Math.min(right - h, Math.max(left + h, pos[i].x));
    pos[i].y = bottom - top < up + down ? (top + bottom) / 2 : Math.min(bottom - down, Math.max(top + up, pos[i].y));
  };
  pos.forEach((_, i) => clamp(i));

  const iterations = o.iterations ?? 160;
  for (let it = 0; it < iterations; it++) {
    let any = false;
    for (let i = 0; i < pos.length; i++)
      for (let j = i + 1; j < pos.length; j++) {
        const a = pos[i], b = pos[j];
        const ox = half(pins[i]) + half(pins[j]) + gap - Math.abs(a.x - b.x);
        const oy = up + down + gap - Math.abs(a.y - b.y);
        if (ox <= 0 || oy <= 0) continue;
        any = true;
        // 덜 겹친 방향으로 밀어냄. 오래 안 풀리면(가장자리에 막힘) 반대 방향도 시도
        const horizontal = it < iterations / 2 ? ox < oy : ox >= oy;
        if (horizontal) {
          const s = a.x === b.x ? (i < j ? -1 : 1) : Math.sign(a.x - b.x);
          a.x += (s * ox) / 2; b.x -= (s * ox) / 2;
        } else {
          const s = a.y === b.y ? (i < j ? -1 : 1) : Math.sign(a.y - b.y);
          a.y += (s * oy) / 2; b.y -= (s * oy) / 2;
        }
        clamp(i); clamp(j);
      }
    for (let i = 0; i < pos.length; i++)
      for (const ob of o.obstacles ?? []) {
        const p = pos[i], h = half(pins[i]);
        const overlap = () => [
          Math.min(p.x + h, ob.right) - Math.max(p.x - h, ob.left) + gap,
          Math.min(p.y + down, ob.bottom) - Math.max(p.y - up, ob.top) + gap,
        ];
        let [ox, oy] = overlap();
        if (ox <= 0 || oy <= 0) continue;
        any = true;
        const cx = (ob.left + ob.right) / 2, cy = (ob.top + ob.bottom) / 2;
        const pushX = () => { p.x += (p.x >= cx ? 1 : -1) * ox; clamp(i); [ox, oy] = overlap(); };
        const pushY = () => { p.y += (p.y >= cy ? 1 : -1) * oy; clamp(i); [ox, oy] = overlap(); };
        // 덜 겹친 방향으로 먼저 비키고, 화면 가장자리·다른 버튼에 막혀 여전히 겹치면 다른 방향으로
        // (가장자리 쪽으로 밀 수 없으면 버튼 반대쪽으로)
        if (ox < oy) pushX(); else pushY();
        if (ox > 0 && oy > 0) { if (ox < oy) pushY(); else pushX(); }
        if (ox > 0 && oy > 0) { p.x += (p.x >= cx ? -1 : 1) * (Math.max(0, ob.right - ob.left) + 2 * h + gap); clamp(i); }
      }
    if (!any) break;
  }

  return pos.map((p, i) => ({ ...p, moved: Math.hypot(p.x - pins[i].x, p.y - pins[i].y) > o.flag * 0.35 }));
}

/** 이름표 폭 추정 (한글 한 글자 ≈ 글자 크기) */
export function estimateLabelWidth(text: string, fontSize: number, padX: number): number {
  return [...text].length * fontSize * 1.02 + padX * 2;
}
