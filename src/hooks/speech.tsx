import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const synth: SpeechSynthesis | undefined = typeof window !== 'undefined' ? window.speechSynthesis : undefined;

function pickVoice(voices: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice | undefined {
  const norm = (l: string) => l.replace('_', '-').toLowerCase();
  const want = norm(lang);
  const primary = want.split('-')[0];
  return voices.find((v) => norm(v.lang) === want) ?? voices.find((v) => norm(v.lang).split('-')[0] === primary);
}

export interface SpeakOptions {
  /** 해당 언어 목소리가 기기에 없을 때 대신 읽을 한국어 문장 */
  fallbackKo?: string;
}

interface SpeechApi {
  speak: (text: string, lang?: string, opts?: SpeakOptions) => void;
  stop: () => void;
  speaking: boolean;
  muted: boolean;
  toggleMuted: () => void;
}

const SpeechContext = createContext<SpeechApi | null>(null);

/**
 * 기기 내장 음성(Web Speech API). 앱 전체에서 하나만 두어
 * 화면이 바뀌어도 읽던 말이 끊기지 않고, 새 음성은 이전 음성을 멈춥니다.
 */
export function SpeechProvider({ children }: { children: ReactNode }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => synth?.getVoices() ?? []);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(() => {
    try { return localStorage.getItem('muted') === '1'; } catch { return false; }
  });

  useEffect(() => {
    if (!synth) return;
    const update = () => setVoices(synth.getVoices());
    synth.addEventListener('voiceschanged', update);
    update();
    return () => synth.removeEventListener('voiceschanged', update);
  }, []);

  const speak = useCallback(
    (text: string, lang = 'ko-KR', opts: SpeakOptions = {}) => {
      if (!synth || muted) return;
      synth.cancel();
      let voice = pickVoice(voices, lang);
      let say = text;
      let sayLang = lang;
      if (!voice && voices.length > 0 && opts.fallbackKo) {
        voice = pickVoice(voices, 'ko-KR');
        say = opts.fallbackKo;
        sayLang = 'ko-KR';
      }
      const u = new SpeechSynthesisUtterance(say);
      u.lang = sayLang;
      if (voice) u.voice = voice;
      u.rate = 0.9;
      u.pitch = 1.05;
      u.onstart = () => setSpeaking(true);
      u.onend = u.onerror = () => setSpeaking(false);
      synth.speak(u);
    },
    [voices, muted],
  );

  const stop = useCallback(() => {
    synth?.cancel();
    setSpeaking(false);
  }, []);

  const toggleMuted = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (next) synth?.cancel();
      try { localStorage.setItem('muted', next ? '1' : '0'); } catch { /* 저장 불가 환경 */ }
      return next;
    });
  }, []);

  const api = useMemo(() => ({ speak, stop, speaking, muted, toggleMuted }), [speak, stop, speaking, muted, toggleMuted]);
  return <SpeechContext.Provider value={api}>{children}</SpeechContext.Provider>;
}

export function useSpeech(): SpeechApi {
  const ctx = useContext(SpeechContext);
  if (!ctx) throw new Error('useSpeech must be used inside SpeechProvider');
  return ctx;
}
