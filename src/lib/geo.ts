import { feature } from 'topojson-client';
import { presimplify, quantile, simplify } from 'topojson-simplify';
import type { GeometryCollection, Topology } from 'topojson-specification';
import { geoArea, geoAzimuthalEqualArea, geoNaturalEarth1, geoPath, type GeoPermissibleObjects, type GeoProjection } from 'd3-geo';
import topo from '../data/geo/world.topo.json';
import { continentByNeName } from '../data/continents';
import type { Continent, ContinentId } from '../types';

export interface GeoProps {
  iso: string;
  a3: string;
  name: string;
  continent: string;
}
export type GeoCountry = GeoJSON.Feature<GeoJSON.Geometry, GeoProps> & { continentId: ContinentId | 'antarctica' | null };

const topology = topo as unknown as Topology<{ ne: GeometryCollection<GeoProps> }>;
const fc = feature(topology, topology.objects.ne) as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoProps>;

/** Natural Earth 1:50m 국가 경계 + 앱의 대륙 id */
export const geoCountries: GeoCountry[] = fc.features.map((f) => ({
  ...f,
  continentId:
    f.properties.continent === 'Antarctica' ? 'antarctica' : (continentByNeName[f.properties.continent]?.id ?? null),
}));

/** ISO 코드 → 국가 모양. 같은 코드를 쓰는 작은 해외 영토가 있으면 가장 큰 것(본토)을 사용 */
export const geoByIso: Record<string, GeoCountry> = {};
for (const f of geoCountries) {
  const iso = f.properties.iso?.toLowerCase();
  if (!iso || iso === '-99') continue;
  const prev = geoByIso[iso];
  if (!prev || geoArea(f) > geoArea(prev)) geoByIso[iso] = f;
}

export const SPHERE: GeoPermissibleObjects = { type: 'Sphere' };

/** 지도를 끌어 움직이는 동안 쓰는 단순한 해안선 (매 프레임 빠르게 그리기 위해). 멈추면 원래 해상도로 다시 그림 */
let lowRes: GeoCountry[] | null = null;
export function geoCountriesLow(): GeoCountry[] {
  if (!lowRes) {
    const t = presimplify(JSON.parse(JSON.stringify(topology)));
    const st = simplify(t, quantile(t, 0.75)) as unknown as typeof topology;
    const fs = (feature(st, st.objects.ne) as GeoJSON.FeatureCollection<GeoJSON.Geometry, GeoProps>).features;
    lowRes = fs.map((f, i) => ({ ...f, continentId: geoCountries[i].continentId }));
  }
  return lowRes;
}

/** 대륙 범위 사각형을 경위도선을 따라 촘촘히 찍은 선 (투영 후에도 범위 모양이 유지되도록) */
export function boundsOutline([w, s, e, n]: Continent['bounds']): GeoJSON.LineString {
  const pts: [number, number][] = [];
  const steps = 24;
  for (let i = 0; i <= steps; i++) pts.push([w + ((e - w) * i) / steps, s]);
  for (let i = 0; i <= steps; i++) pts.push([e, s + ((n - s) * i) / steps]);
  for (let i = 0; i <= steps; i++) pts.push([e - ((e - w) * i) / steps, n]);
  for (let i = 0; i <= steps; i++) pts.push([w, n - ((n - s) * i) / steps]);
  return { type: 'LineString', coordinates: pts };
}

// ── 세계 지도 (고정 좌표계 1000 × H) ──
export const WORLD_W = 1000;
export const worldProjection: GeoProjection = geoNaturalEarth1().rotate([-10, 0]).fitWidth(WORLD_W, SPHERE);
export const worldPath = geoPath(worldProjection);
/** 북위 84°~남위 70° 만 보여 줌 (남극은 아래쪽 띠로만) */
const top = worldProjection([0, 84])![1];
const bottom = worldProjection([0, -70])![1];
export const WORLD_VIEWBOX = { x: 0, y: top, w: WORLD_W, h: bottom - top };

// ── 대륙 지도 (화면 크기에 맞춰 투영) ──
export interface Insets { top: number; right: number; bottom: number; left: number }

export function continentProjection(c: Continent, width: number, height: number, inset: Insets, fit: Continent['bounds'] = c.bounds): GeoProjection {
  const [w, s, e, n] = fit;
  const center: [number, number] = [(w + e) / 2, (s + n) / 2];
  return geoAzimuthalEqualArea()
    .rotate([-center[0], -center[1]])
    .clipAngle(100)
    .fitExtent(
      [[inset.left, inset.top], [Math.max(inset.left + 10, width - inset.right), Math.max(inset.top + 10, height - inset.bottom)]],
      boundsOutline(fit),
    );
}

// ── 대륙 사이를 굴러가듯 이동하기 위한 "시점" ──
export interface MapView {
  rotate: [number, number, number];
  scale: number;
  translate: [number, number];
}

export const viewOf = (p: GeoProjection): MapView => ({
  rotate: p.rotate() as [number, number, number],
  scale: p.scale(),
  translate: p.translate() as [number, number],
});

export const projectionFor = (v: MapView): GeoProjection =>
  geoAzimuthalEqualArea().rotate(v.rotate).scale(v.scale).translate(v.translate).clipAngle(100);

/**
 * 두 시점 사이를 k(0~1)만큼 이동. 중심은 경도·위도를 따라 움직이고,
 * 멀리 갈수록 중간에 살짝 멀어졌다가 다시 다가가서 지구본을 돌리는 느낌을 줍니다.
 */
export function lerpView(a: MapView, b: MapView, k: number): MapView {
  // 경도·위도를 따로 보간 → 북극을 넘어가며 지도가 옆으로 눕지 않고 항상 북쪽이 위
  const la = -a.rotate[0], lb = -b.rotate[0];
  const dLon = ((lb - la + 540) % 360) - 180; // 가까운 쪽으로 (예: 북아메리카 → 아시아는 태평양 건너 서쪽)
  const lon = la + dLon * k;
  const lat = -a.rotate[1] + (-b.rotate[1] + a.rotate[1]) * k;
  const pull = 1 - 0.3 * Math.sin(Math.PI * k);
  return {
    rotate: [-lon, -lat, 0],
    scale: a.scale * Math.pow(b.scale / a.scale, k) * pull,
    translate: [a.translate[0] + (b.translate[0] - a.translate[0]) * k, a.translate[1] + (b.translate[1] - a.translate[1]) * k],
  };
}
