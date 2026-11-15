import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { geoGraticule10 } from 'd3-geo';
import { continents, continentById } from '../data/continents';
import { boundsOutline, geoCountries, SPHERE, WORLD_VIEWBOX, worldPath, worldProjection } from '../lib/geo';
import { useSpeech } from '../hooks/speech';
import { useTapGuard } from '../hooks/useTapGuard';
import { SpeakerIcon } from '../components/icons';
import type { ContinentId } from '../types';

type VB = { x: number; y: number; w: number; h: number };
const ZOOM_MS = 650;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// 지도 모양은 한 번만 계산
const sphereD = worldPath(SPHERE) ?? '';
const graticuleD = worldPath(geoGraticule10()) ?? '';
const groups = (() => {
  const by: Record<string, string[]> = {};
  for (const f of geoCountries) {
    const key = f.continentId ?? 'none';
    (by[key] ??= []).push(worldPath(f) ?? '');
  }
  return Object.fromEntries(Object.entries(by).map(([k, ds]) => [k, ds.join('')]));
})();

export function WorldScreen() {
  const navigate = useNavigate();
  const { speak, muted, toggleMuted } = useSpeech();
  const guard = useTapGuard();
  const reduce = useReducedMotion();
  const [vb, setVb] = useState<VB>(WORLD_VIEWBOX);
  const [zooming, setZooming] = useState<ContinentId | null>(null);
  const [hint, setHint] = useState(false);
  const [penguin, setPenguin] = useState(false);
  const touched = useRef(false);
  const raf = useRef(0);

  // 몇 초 동안 아무것도 누르지 않으면 대륙 이름표가 차례로 통통 튀며 안내
  useEffect(() => {
    const t = setTimeout(() => { if (!touched.current) setHint(true); }, 3500);
    return () => { clearTimeout(t); cancelAnimationFrame(raf.current); };
  }, []);

  const labels = useMemo(
    () => continents.map((c) => {
      const [x, y] = worldProjection(c.labelAt)!;
      return { c, left: ((x - WORLD_VIEWBOX.x) / WORLD_VIEWBOX.w) * 100, top: ((y - WORLD_VIEWBOX.y) / WORLD_VIEWBOX.h) * 100 };
    }),
    [],
  );

  const goContinent = (id: ContinentId) => guard(() => {
    if (zooming) return;
    touched.current = true;
    setHint(false);
    const c = continentById[id];
    speak(c.nameKo);
    if (reduce) { navigate(`/${id}`); return; }

    // 누른 대륙 쪽으로 지도를 확대한 뒤 대륙 화면으로 이동
    const [[x0, y0], [x1, y1]] = worldPath.bounds(boundsOutline(c.bounds));
    const pad = 20;
    let to: VB = { x: x0 - pad, y: y0 - pad, w: x1 - x0 + pad * 2, h: y1 - y0 + pad * 2 };
    const aspect = WORLD_VIEWBOX.w / WORLD_VIEWBOX.h;
    if (to.w / to.h > aspect) { const h = to.w / aspect; to = { ...to, y: to.y - (h - to.h) / 2, h }; }
    else { const w = to.h * aspect; to = { ...to, x: to.x - (w - to.w) / 2, w }; }

    setZooming(id);
    const from = WORLD_VIEWBOX;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ZOOM_MS);
      const k = ease(t);
      setVb({ x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k, w: from.w + (to.w - from.w) * k, h: from.h + (to.h - from.h) * k });
      if (t < 1) raf.current = requestAnimationFrame(step);
      else navigate(`/${id}`);
    };
    raf.current = requestAnimationFrame(step);
  });

  const tapAntarctica = () => guard(() => {
    touched.current = true;
    setPenguin(true);
    speak('남극에는 나라가 없어요. 펭귄이 살아요!');
    setTimeout(() => setPenguin(false), 2600);
  });

  return (
    <div className="screen world">
      <header className="topbar">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="30" fill="#7FC4EC" />
            <path d="M14 24c8-10 22-10 26 0-6 4-4 12-12 14-8 0-10-8-14-14zM38 40c6-2 12 2 10 10-6 2-10-4-10-10z" fill="#52C27A" />
          </svg>
          <h1>지구마을 탐험대</h1>
        </div>
        <button type="button" className="icon-btn" onClick={toggleMuted} aria-label={muted ? '소리 켜기' : '소리 끄기'} aria-pressed={!muted}>
          <SpeakerIcon off={muted} />
        </button>
      </header>

      <div className="world__stage">
        <div className="world__map" style={{ aspectRatio: `${WORLD_VIEWBOX.w} / ${WORLD_VIEWBOX.h}` }}>
          <svg viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} className="map-svg" role="img" aria-label="세계 지도">
            <defs>
              <radialGradient id="ocean" cx="50%" cy="40%" r="75%">
                <stop offset="0%" stopColor="#BFE7FB" />
                <stop offset="100%" stopColor="#6FB8E6" />
              </radialGradient>
            </defs>
            <path d={sphereD} fill="url(#ocean)" />
            <path d={graticuleD} className="graticule" />
            {groups.none && <path d={groups.none} className="land land--none" />}
            <path d={groups.antarctica} className="land land--antarctica" onClick={tapAntarctica} />
            {continents.map((c) => (
              <path
                key={c.id}
                d={groups[c.id]}
                className={`land land--continent ${zooming && zooming !== c.id ? 'is-faded' : ''}`}
                style={{ '--c': c.color } as CSSProperties}
                onClick={() => goContinent(c.id)}
              />
            ))}
          </svg>

          <div className={`world__labels ${zooming ? 'is-hidden' : ''}`}>
            {labels.map(({ c, left, top }, i) => (
              <button
                key={c.id}
                type="button"
                className={`continent-label ${hint ? 'is-hinting' : ''}`}
                style={{ left: `${left}%`, top: `${top}%`, '--c': c.color, animationDelay: `${i * 0.25}s` } as CSSProperties}
                onClick={() => goContinent(c.id)}
              >
                {c.nameKo}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {penguin && (
              <motion.div
                className="penguin"
                initial={{ y: 40, opacity: 0, x: '-50%' }}
                animate={{ y: 0, opacity: 1, x: '-50%' }}
                exit={{ y: 40, opacity: 0, x: '-50%' }}
              >
                <span aria-hidden="true">🐧</span> 남극에는 펭귄이 살아요!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 세로 화면·휴대폰: 지도 아래에 큰 대륙 버튼 */}
        <div className="world__list">
          {continents.map((c) => (
            <button key={c.id} type="button" className="continent-chip" style={{ '--c': c.color } as CSSProperties} onClick={() => goContinent(c.id)}>
              {c.nameKo}
            </button>
          ))}
        </div>
      </div>

      <footer className="world__footer">
        <p className="hint-pill">가고 싶은 대륙을 눌러 보세요!</p>
        <button type="button" className="credits-link" onClick={() => navigate('/credits')}>사진 출처</button>
      </footer>
    </div>
  );
}
