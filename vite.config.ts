import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base './' : GitHub Pages(하위 경로)와 Netlify(루트) 양쪽에서 같은 빌드가 동작하도록 상대 경로 사용
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node' },
});
