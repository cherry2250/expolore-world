import { useLayoutEffect, useRef, useState } from 'react';

export interface Box { left: number; top: number; right: number; bottom: number; width: number; height: number }

const EMPTY: Box = { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };

/** 요소의 화면상 위치·크기를 추적합니다 (회전, 창 크기, 글꼴 로딩으로 바뀔 때마다 갱신). */
export function useRect<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState<Box>(EMPTY);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox((b) =>
        b.left === r.left && b.top === r.top && b.width === r.width && b.height === r.height
          ? b
          : { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  return [ref, box] as const;
}
