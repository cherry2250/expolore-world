import { describe, expect, it } from 'vitest';
import { layoutPins } from '../src/lib/pinLayout';

const opts = { flag: 46, labelH: 24, safe: { left: 0, top: 0, right: 400, bottom: 600 } };
const box = (p: { x: number; y: number }, w: number) => ({ l: p.x - w / 2, r: p.x + w / 2, t: p.y - 23, b: p.y + 23 + 20 });
const overlap = (a: ReturnType<typeof box>, b: ReturnType<typeof box>) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;

describe('핀 배치', () => {
  it('한 점에 몰린 6개 핀을 서로 겹치지 않게 펼침', () => {
    const pins = Array.from({ length: 6 }, () => ({ x: 200, y: 300, labelW: 70 }));
    const out = layoutPins(pins, opts);
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) expect(overlap(box(out[i], 70), box(out[j], 70))).toBe(false);
  });

  it('안전 영역 밖의 핀은 안으로 들여옴', () => {
    const [p] = layoutPins([{ x: 395, y: 598, labelW: 60 }], opts);
    expect(p.x + 30).toBeLessThanOrEqual(400);
    expect(p.y + 23 + 20).toBeLessThanOrEqual(600);
  });

  it('겹치지 않는 핀은 그대로 둠', () => {
    const out = layoutPins([{ x: 100, y: 100, labelW: 60 }, { x: 300, y: 400, labelW: 60 }], opts);
    expect(out.map((p) => [p.x, p.y, p.moved])).toEqual([[100, 100, false], [300, 400, false]]);
  });
});

describe('핀 배치 – 고정 버튼 피하기', () => {
  it('화면 가장자리의 버튼 밑에 있는 핀은 위·아래로 비켜남', () => {
    const button = { left: 340, top: 280, right: 400, bottom: 340 };
    const [p] = layoutPins([{ x: 380, y: 300, labelW: 60 }], { ...opts, obstacles: [button] });
    const b = box(p, 60);
    expect(b.l < button.right && button.left < b.r && b.t < button.bottom && button.top < b.b).toBe(false);
  });
});

describe('핀 배치 – 위아래 공간이 부족할 때', () => {
  it('버튼과 아래 목록 사이가 좁으면 옆으로 비켜남', () => {
    const button = { left: 256, top: 252, right: 310, bottom: 317 };
    const safe = { left: 8, top: 100, right: 312, bottom: 376 };
    const [p] = layoutPins([{ x: 270, y: 333, labelW: 52 }], { flag: 46, labelH: 24, safe, obstacles: [button] });
    const b = { l: p.x - 26, r: p.x + 26, t: p.y - 23, b: p.y + 23 + 20 };
    expect(b.l < button.right && button.left < b.r && b.t < button.bottom && button.top < b.b).toBe(false);
    expect(b.b).toBeLessThanOrEqual(376);
  });
});
