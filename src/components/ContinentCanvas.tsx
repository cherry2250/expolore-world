import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { geoGraticule10, geoPath } from 'd3-geo';
import { continentById } from '../data/continents';
import { countryById } from '../data/countries';
import { geoCountries, geoCountriesLow, projectionFor, SPHERE, type GeoCountry, type MapView } from '../lib/geo';
import { mixHex } from '../lib/color';
import type { ContinentId } from '../types';

const OTHER = '#ECE5D3';
const OCEAN = '#74BBE8';
const graticule = geoGraticule10();

export interface ContinentCanvasHandle {
  /**
   * view 시점으로 지도를 그림. next 대륙 쪽으로 k(0~1)만큼 넘어가는 중이면 두 대륙 색을 섞고,
   * 움직이는 중(0<k<1)에는 단순한 해안선으로 빠르게 그림
   */
  draw: (view: MapView, next: ContinentId | null, k: number) => void;
}

interface Props {
  width: number;
  height: number;
  current: ContinentId;
}

type Group = 'other' | 'curSame' | 'curFeat' | 'nextSame' | 'nextFeat';

const featuredIso = (id: ContinentId) => new Set(continentById[id].countryIds.map((c) => countryById[c].iso));

/** 나라마다 어느 색 묶음에 속하는지 (현재 대륙·다음 대륙 조합별로 한 번만 계산) */
const groupCache = new Map<string, Group[]>();
function groupsFor(cur: ContinentId, next: ContinentId | null): Group[] {
  const key = `${cur}|${next}`;
  let g = groupCache.get(key);
  if (!g) {
    const fc = featuredIso(cur), fn = next ? featuredIso(next) : null;
    g = geoCountries.map((f): Group => {
      const iso = f.properties.iso?.toLowerCase();
      if (f.continentId === cur) return fc.has(iso) ? 'curFeat' : 'curSame';
      if (next && f.continentId === next) return fn!.has(iso) ? 'nextFeat' : 'nextSame';
      return 'other';
    });
    groupCache.set(key, g);
  }
  return g;
}

/**
 * 대륙 지도를 canvas에 그립니다. 끌어서 다른 대륙으로 굴러갈 때 매 프레임 다시 그려야 해서
 * SVG보다 canvas가 태블릿에서 훨씬 부드럽습니다. 나라 모양은 프레임마다 한 번만 투영합니다.
 */
export const ContinentCanvas = forwardRef<ContinentCanvasHandle, Props>(function ContinentCanvas({ width, height, current }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const c = canvasRef.current;
    if (!c || !width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.round(width * dpr);
    c.height = Math.round(height * dpr);
  }, [width, height]);

  useImperativeHandle(ref, () => ({
    draw(view, next, k) {
      const c = canvasRef.current;
      const ctx = c?.getContext('2d');
      if (!c || !ctx || !width || !height) return;
      const dpr = c.width / width;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const movingNow = k > 0 && k < 1;
      const projection = projectionFor(view).precision(movingNow ? 2 : 0.7);
      const features: GeoCountry[] = movingNow ? geoCountriesLow() : geoCountries;
      const groups = groupsFor(current, next && k > 0 ? next : null);

      // 바다
      ctx.fillStyle = OCEAN;
      ctx.fillRect(0, 0, width, height);
      const sphere = new Path2D();
      geoPath(projection, sphere as unknown as CanvasRenderingContext2D)(SPHERE);
      const g = ctx.createRadialGradient(width / 2, height * 0.45, 0, width / 2, height * 0.45, Math.max(width, height) * 0.7);
      g.addColorStop(0, '#C4E9FB');
      g.addColorStop(1, OCEAN);
      ctx.fillStyle = g; ctx.fill(sphere);
      const grat = new Path2D();
      geoPath(projection, grat as unknown as CanvasRenderingContext2D)(graticule);
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 0.6; ctx.stroke(grat);

      // 땅: 색 묶음별 경로에 한 번씩만 투영해 담기
      const paths: Record<Group, Path2D> = { other: new Path2D(), curSame: new Path2D(), curFeat: new Path2D(), nextSame: new Path2D(), nextFeat: new Path2D() };
      // Path2D에 바로 그리기 (SVG 문자열을 만들었다 다시 읽는 비용 없음)
      const gens = Object.fromEntries(
        (Object.keys(paths) as Group[]).map((key) => [key, geoPath(projection, paths[key] as unknown as CanvasRenderingContext2D)]),
      ) as Record<Group, ReturnType<typeof geoPath>>;
      features.forEach((f, i) => { gens[groups[i]](f); });
      const cur = continentById[current];
      const nx = next ? continentById[next] : null;
      const colors: Record<Group, string> = {
        other: OTHER,
        curSame: mixHex(cur.soft, OTHER, k),
        curFeat: mixHex(cur.color, OTHER, k),
        nextSame: nx ? mixHex(OTHER, nx.soft, k) : OTHER,
        nextFeat: nx ? mixHex(OTHER, nx.color, k) : OTHER,
      };
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 0.7; ctx.lineJoin = 'round';
      for (const key of Object.keys(paths) as Group[]) {
        ctx.fillStyle = colors[key];
        ctx.fill(paths[key]);
        ctx.stroke(paths[key]);
      }
    },
  }), [width, height, current]);

  return <canvas ref={canvasRef} className="map-canvas" style={{ width, height }} aria-hidden="true" />;
});
