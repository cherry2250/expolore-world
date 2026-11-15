import { useLayoutEffect, useRef, useState } from 'react';

/** 요소의 레이아웃 크기(px)를 추적합니다. 회전·창 크기 변경 시 갱신됩니다. */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // getBoundingClientRect는 확대 애니메이션 중 값이 커지므로 레이아웃 크기를 사용
      const r = { width: el.clientWidth, height: el.clientHeight };
      setSize((s) => (s.width === r.width && s.height === r.height ? s : r));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
}
