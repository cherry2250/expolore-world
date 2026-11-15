import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { continentById, isContinentId, neighborsOf } from '../data/continents';
import { countryById } from '../data/countries';
import { continentProjection, lerpView, projectionFor, viewOf, type MapView } from '../lib/geo';
import { useElementSize } from '../hooks/useElementSize';
import { useRect, type Box } from '../hooks/useRect';
import { estimateLabelWidth, layoutPins } from '../lib/pinLayout';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useSpeech } from '../hooks/speech';
import { useTapGuard } from '../hooks/useTapGuard';
import { RoundButton } from '../components/RoundButton';
import { CountryModal } from '../components/CountryModal';
import { ContinentCanvas, type ContinentCanvasHandle } from '../components/ContinentCanvas';
import { BackIcon, NextIcon } from '../components/icons';
import type { Continent, ContinentId } from '../types';

export function ContinentScreen() {
  const { continentId, countryId } = useParams();
  if (!isContinentId(continentId)) return <Navigate to="/" replace />;
  if (countryId && countryById[countryId]?.continentId !== continentId) return <Navigate to={`/${continentId}`} replace />;
  // 대륙이 바뀌면 화면을 새로 만들어 상태(끌기 진행도 등)를 초기화
  return <ContinentView key={continentId} continentId={continentId} countryId={countryId} />;
}

type Dir = 'west' | 'east';
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function ContinentView({ continentId, countryId }: { continentId: ContinentId; countryId?: string }) {
  const continent = continentById[continentId];
  const neighbors = neighborsOf(continentId);
  const navigate = useNavigate();
  const location = useLocation();
  const { speak } = useSpeech();
  const guard = useTapGuard();
  const reduce = useReducedMotion();
  const swiped = (location.state as { swiped?: boolean } | null)?.swiped;
  // 휴대폰 세로·가로처럼 좁거나 낮은 화면은 핀을 작게 (CSS의 같은 조건과 맞춤)
  const compact = useMediaQuery('(max-width: 599px), (max-height: 500px) and (orientation: landscape)');
  const [stageRef, { width, height }] = useElementSize<HTMLDivElement>();
  const [headerRef, headerBox] = useRect<HTMLElement>();
  const [chipsRef, chipsBox] = useRect<HTMLElement>();
  const [westRef, westBox] = useRect<HTMLButtonElement>();
  const [eastRef, eastBox] = useRect<HTMLButtonElement>();
  const pinRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const canvasRef = useRef<ContinentCanvasHandle>(null);

  const countryList = useMemo(() => continent.countryIds.map((id) => countryById[id]), [continent]);
  // 나라 목록이 세로 기둥(낮은 가로 화면)이면 오른쪽, 아니면 아래쪽에 있음
  const chipsColumn = chipsBox.height > chipsBox.width;

  // 화면 크기에 맞춘 지도 시점(현재·양옆 대륙)과 핀 배치
  const map = useMemo(() => {
    if (!width || !height || !headerBox.height || !chipsBox.height) return null;
    const flag = compact ? 46 : 64;
    const labelFont = compact ? 14 : 18;
    const labelPad = compact ? 10 : 14;
    const labelH = compact ? 24 : 31;
    const safe = {
      left: 8,
      top: headerBox.bottom + 8,
      right: chipsColumn ? chipsBox.left - 8 : width - 8,
      bottom: chipsColumn ? height - 8 : chipsBox.top - 6,
    };
    const inset = { top: safe.top + flag / 2, left: safe.left + 16, right: width - safe.right + 16, bottom: height - safe.bottom + flag / 2 + labelH };
    // 좁은 세로 화면(휴대폰)은 대륙 전체를 넣으면 지도가 작아 핀이 몰리므로, 소개하는 나라들 범위에 맞춰 확대
    const narrow = width < 600 && height > width;
    const viewFor = (c: Continent): MapView => {
      const pins = c.countryIds.map((id) => countryById[id].pin);
      const lons = pins.map((p) => p[0]), lats = pins.map((p) => p[1]);
      const fit: Continent['bounds'] = narrow
        ? [Math.min(...lons) - 5, Math.min(...lats) - 5, Math.max(...lons) + 5, Math.max(...lats) + 5]
        : c.bounds;
      return viewOf(continentProjection(c, width, height, inset, fit));
    };
    const views = { cur: viewFor(continent), west: viewFor(continentById[neighbors.west]), east: viewFor(continentById[neighbors.east]) };

    const projection = projectionFor(views.cur);
    const raw = countryList.map((c) => {
      const p = projection(c.pin) ?? [0, 0];
      return { x: p[0], y: p[1], labelW: estimateLabelWidth(c.nameKo, labelFont, labelPad) };
    });
    const obstacles = [westBox, eastBox].filter((b: Box) => b.width > 0);
    const placed = layoutPins(raw, { flag, labelH, safe, obstacles });
    const pins = countryList.map((c, i) => ({ c, x0: raw[i].x, y0: raw[i].y, ...placed[i] }));
    return { views, pins };
  }, [width, height, compact, headerBox, chipsBox, chipsColumn, westBox, eastBox, continent, neighbors.west, neighbors.east, countryList]);

  // ── 좌우로 끌어서 이웃 대륙으로 굴러가기 ──
  // t: -1(서쪽 이웃) … 0(현재) … 1(동쪽 이웃). 매 프레임 그려야 해서 React 상태가 아닌 ref로 관리
  const tRef = useRef(0);
  const animRef = useRef(0);
  const [moving, setMoving] = useState(false);
  const drag = useRef<{ id: number; x0: number; y0: number; active: boolean; lastX: number; lastT: number; v: number } | null>(null);
  const suppressClick = useRef(false);

  const render = useCallback((t: number) => {
    tRef.current = t;
    if (!map) return;
    if (t === 0) { canvasRef.current?.draw(map.views.cur, null, 0); return; }
    const dir: Dir = t > 0 ? 'east' : 'west';
    const k = Math.abs(t);
    canvasRef.current?.draw(lerpView(map.views.cur, map.views[dir], k), neighbors[dir], k);
  }, [map, neighbors]);

  useLayoutEffect(() => { render(tRef.current); }, [render]);
  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const finish = useCallback((dir: Dir) => {
    const next = neighbors[dir];
    speak(continentById[next].nameKo);
    navigate(`/${next}`, { replace: true, state: { swiped: true } });
  }, [neighbors, navigate, speak]);

  const animateTo = useCallback((target: -1 | 0 | 1) => {
    cancelAnimationFrame(animRef.current);
    if (reduce && target !== 0) { finish(target > 0 ? 'east' : 'west'); return; }
    const from = tRef.current;
    const dist = Math.abs(target - from);
    if (dist < 0.001) { if (target === 0) setMoving(false); return; }
    const dur = 260 + 520 * dist;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      render(from + (target - from) * ease(p));
      if (p < 1) animRef.current = requestAnimationFrame(step);
      else if (target === 0) setMoving(false);
      else finish(target > 0 ? 'east' : 'west');
    };
    animRef.current = requestAnimationFrame(step);
  }, [reduce, render, finish]);

  const go = useCallback((dir: Dir) => guard(() => {
    if (countryId) return;
    setMoving(true);
    animateTo(dir === 'east' ? 1 : -1);
  }), [guard, countryId, animateTo]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (countryId || !e.isPrimary) return;
    cancelAnimationFrame(animRef.current);
    drag.current = { id: e.pointerId, x0: e.clientX - (-tRef.current * width * 0.8), y0: e.clientY, active: tRef.current !== 0, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    if (!d.active) {
      // 가로로 확실히 움직였을 때만 끌기 시작 (핀을 누르려던 손가락은 그대로 탭으로 처리)
      if (Math.abs(dx) < 12 || Math.abs(dx) < Math.abs(e.clientY - d.y0)) return;
      d.active = true;
      setMoving(true);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* 이미 끝난 포인터 */ }
    }
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.7 * ((e.clientX - d.lastX) / dt) + 0.3 * d.v;
    d.lastX = e.clientX; d.lastT = e.timeStamp;
    render(Math.max(-1, Math.min(1, -dx / (width * 0.8))));
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || e.pointerId !== d.id || !d.active) return;
    suppressClick.current = true;
    setTimeout(() => { suppressClick.current = false; }, 0);
    const t = tRef.current, fling = -d.v; // px/ms, 양수면 동쪽으로 넘기는 중
    const target = t > 0.3 || (fling > 0.35 && t > 0.04) ? 1 : t < -0.3 || (fling < -0.35 && t < -0.04) ? -1 : 0;
    animateTo(target);
  };

  // 키보드 ←/→ 로도 이동 (PC)
  useEffect(() => {
    if (countryId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go('west');
      if (e.key === 'ArrowRight') go('east');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [countryId, go]);

  // ── 나라 모달 ──
  const openCountry = (id: string) => guard(() => {
    speak(countryById[id].nameKo);
    navigate(`/${continentId}/${id}`, { state: { fromMap: true } });
  });

  const closeModal = useCallback(() => {
    const id = countryId;
    if ((location.state as { fromMap?: boolean } | null)?.fromMap) navigate(-1);
    else navigate(`/${continentId}`, { replace: true });
    // 닫은 뒤에는 방금 본 나라 핀으로 포커스를 되돌림
    if (id) setTimeout(() => pinRefs.current[id]?.focus(), 50);
  }, [countryId, continentId, location.state, navigate]);

  const step = useCallback((dir: 1 | -1) => {
    if (!countryId) return;
    const ids = continent.countryIds;
    const next = ids[(ids.indexOf(countryId) + dir + ids.length) % ids.length];
    speak(countryById[next].nameKo);
    navigate(`/${continentId}/${next}`, { replace: true, state: location.state });
  }, [countryId, continent.countryIds, continentId, location.state, navigate, speak]);
  const onPrev = useCallback(() => step(-1), [step]);
  const onNext = useCallback(() => step(1), [step]);

  const country = countryId ? countryById[countryId] : undefined;
  const style = { '--c': continent.color, '--c-soft': continent.soft } as CSSProperties;
  // 낮은 가로 화면에서는 오른쪽 버튼을 나라 목록 기둥 왼쪽에 둠
  const eastStyle: CSSProperties | undefined = chipsColumn && width ? { right: width - chipsBox.left + 8 } : undefined;

  return (
    <div className="screen continent" style={style}>
      <motion.div
        ref={stageRef}
        className={`continent__stage ${moving ? 'is-moving' : ''}`}
        initial={swiped ? false : { opacity: 0, scale: reduce ? 1 : 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(e) => { if (suppressClick.current) { e.stopPropagation(); e.preventDefault(); } }}
        role="img"
        aria-label={`${continent.nameKo} 지도. 옆으로 밀면 다른 대륙으로 갈 수 있어요.`}
      >
        <ContinentCanvas ref={canvasRef} width={width} height={height} current={continentId} />

        {map && (
          <svg className="map-overlay" width={width} height={height} aria-hidden="true">
            {/* 핀을 옮겼으면 실제 위치에 점을 찍고 선으로 연결 */}
            {map.pins.filter((p) => p.moved).map((p) => (
              <g key={p.c.id} className="pin-leader">
                <line x1={p.x0} y1={p.y0} x2={p.x} y2={p.y} />
                <circle cx={p.x0} cy={p.y0} r={5} />
              </g>
            ))}
          </svg>
        )}

        {map?.pins.map(({ c, x, y }, i) => (
          // 바깥 div가 위치·가운데 정렬을, 안쪽 버튼이 등장 애니메이션을 맡음 (transform 충돌 방지)
          <div key={c.id} className="pin-anchor" style={{ left: x, top: y }}>
            <motion.button
              ref={(el) => { pinRefs.current[c.id] = el; }}
              type="button"
              className="pin"
              initial={{ opacity: 0, y: reduce ? 0 : -24, scale: reduce ? 1 : 0.6 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: reduce ? 0 : (swiped ? 0.05 : 0.25) + i * 0.08, type: 'spring', damping: 14, stiffness: 260 }}
              onClick={() => openCountry(c.id)}
              aria-label={c.nameKo}
            >
              <span className={`pin__flag fi fi-${c.iso} fis`} aria-hidden="true" />
              <span className="pin__label">{c.nameKo}</span>
            </motion.button>
          </div>
        ))}
      </motion.div>

      {/* 이웃 대륙으로 가는 버튼 (스와이프를 못 하는 아이도 누르기만 하면 이동) */}
      <button ref={westRef} type="button" className="side-nav side-nav--west" onClick={() => go('west')} aria-label={`${continentById[neighbors.west].nameKo}로 가기`}>
        <span className="side-nav__face"><BackIcon /></span>
        <span className="side-nav__label">{continentById[neighbors.west].nameKo}</span>
      </button>
      <button ref={eastRef} type="button" className="side-nav side-nav--east" style={eastStyle} onClick={() => go('east')} aria-label={`${continentById[neighbors.east].nameKo}로 가기`}>
        <span className="side-nav__face"><NextIcon /></span>
        <span className="side-nav__label">{continentById[neighbors.east].nameKo}</span>
      </button>

      <header ref={headerRef} className="continent__header">
        <RoundButton label="세계 지도로 돌아가기" caption="세계지도" onClick={() => guard(() => navigate('/'))}>
          <BackIcon />
        </RoundButton>
        <h1 className="continent__title">{continent.nameKo}</h1>
      </header>

      <nav ref={chipsRef} className="chips" aria-label="나라 고르기">
        {countryList.map((c) => (
          <button key={c.id} type="button" className={`chip ${c.id === countryId ? 'is-active' : ''}`} onClick={() => openCountry(c.id)}>
            <span className={`chip__flag fi fi-${c.iso} fis`} aria-hidden="true" />
            {c.nameKo}
          </button>
        ))}
      </nav>

      <AnimatePresence>
        {country && (
          <CountryModal key="modal" country={country} continent={continent} onClose={closeModal} onPrev={onPrev} onNext={onNext} />
        )}
      </AnimatePresence>
    </div>
  );
}
