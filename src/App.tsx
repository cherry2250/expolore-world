import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { SpeechProvider } from './hooks/speech';
import { WorldScreen } from './screens/WorldScreen';
import { ContinentScreen } from './screens/ContinentScreen';
import { CreditsScreen } from './screens/CreditsScreen';

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SpeechProvider>
        <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<WorldScreen />} />
            <Route path="/credits" element={<CreditsScreen />} />
            <Route path="/:continentId" element={<ContinentScreen />} />
            <Route path="/:continentId/:countryId" element={<ContinentScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </SpeechProvider>
    </MotionConfig>
  );
}
