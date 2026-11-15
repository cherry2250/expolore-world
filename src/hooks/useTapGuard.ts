import { useCallback, useRef } from 'react';

/** 300ms 안에 반복된 탭은 한 번으로 처리합니다 (아이들의 연타 방지). */
export function useTapGuard(ms = 300) {
  const last = useRef(0);
  return useCallback(
    (fn: () => void) => {
      const now = performance.now();
      if (now - last.current < ms) return;
      last.current = now;
      fn();
    },
    [ms],
  );
}
