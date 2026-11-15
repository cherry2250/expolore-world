import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useDragControls, useReducedMotion } from 'motion/react';
import type { Continent, Country, CultureKind, HighlightKind } from '../types';
import { creditFor, imageUrl } from '../lib/assets';
import { useSpeech } from '../hooks/speech';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { SpeakButton } from './SpeakButton';
import { AnimalIcon, BackIcon, CloseIcon, CostumeIcon, FoodIcon, GreetingIcon, LandmarkIcon, MusicIcon, NextIcon } from './icons';

type Tab = 'greeting' | CultureKind;

type TabDef = { id: Tab; label: string; Icon: typeof GreetingIcon };

// 4번째 탭은 나라마다 의상 / 동물 / 음악 중 하나
const HIGHLIGHT_TAB: Record<HighlightKind, Omit<TabDef, 'id'>> = {
  costume: { label: '의상', Icon: CostumeIcon },
  animal: { label: '동물', Icon: AnimalIcon },
  music: { label: '음악', Icon: MusicIcon },
};

function tabsFor(country: Country): TabDef[] {
  return [
    { id: 'greeting', label: '인사', Icon: GreetingIcon },
    { id: 'food', label: '음식', Icon: FoodIcon },
    { id: 'landmark', label: '명소', Icon: LandmarkIcon },
    { id: 'highlight', ...HIGHLIGHT_TAB[country.highlight.kind] },
  ];
}

interface Props {
  country: Country;
  continent: Continent;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function CountryModal({ country, continent, onClose, onPrev, onNext }: Props) {
  const [tab, setTab] = useState<Tab>('greeting');
  const isPhone = useMediaQuery('(max-width: 599px)');
  const reduce = useReducedMotion();
  const dragControls = useDragControls();
  const cardRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // 나라가 바뀌면 항상 "인사" 탭부터, 사진은 미리 받아 둠
  useEffect(() => {
    setTab('greeting');
    (['food', 'landmark', 'highlight'] as const).forEach((k) => { new Image().src = imageUrl(country.id, k); });
  }, [country.id]);

  // 열릴 때 포커스를 모달 안으로, Esc 닫기, Tab 키는 모달 안에서만 순환
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Tab' && cardRef.current) {
        const f = cardRef.current.querySelectorAll<HTMLElement>('button, [href]');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  const style = { '--c': continent.color, '--c-soft': continent.soft } as CSSProperties;

  const sheetMotion = isPhone
    ? { initial: { y: '100%' }, animate: { y: 0 }, exit: { y: '100%' } }
    : { initial: { opacity: 0, scale: reduce ? 1 : 0.92 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: reduce ? 1 : 0.95 } };

  return (
    <motion.div className="modal" style={style} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="modal__backdrop" onClick={onClose} aria-hidden="true" />

      {!isPhone && (
        <>
          <button type="button" className="modal__arrow modal__arrow--prev" onClick={onPrev} aria-label="이전 나라"><BackIcon size={36} /></button>
          <button type="button" className="modal__arrow modal__arrow--next" onClick={onNext} aria-label="다음 나라"><NextIcon size={36} /></button>
        </>
      )}

      <motion.div
        ref={cardRef}
        className="modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="country-title"
        {...sheetMotion}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        drag={isPhone ? 'y' : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => { if (info.offset.y > 120 || info.velocity.y > 600) onClose(); }}
      >
        {isPhone && (
          <div className="modal__handle" onPointerDown={(e) => dragControls.start(e)} aria-hidden="true"><span /></div>
        )}

        <button ref={closeRef} type="button" className="modal__close" onClick={onClose} aria-label="닫기"><CloseIcon /></button>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={country.id}
            className="modal__body"
            initial={{ opacity: 0, x: reduce ? 0 : 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduce ? 0 : -24 }}
            transition={{ duration: 0.18 }}
          >
            <header className="modal__header">
              <span className={`modal__flag fi fi-${country.iso}`} role="img" aria-label={`${country.nameKo} 국기`} />
              <div className="modal__titles">
                <h2 id="country-title" className="modal__name">{country.nameKo}</h2>
                <p className="modal__sub">{country.nameEn} · {continent.nameKo}</p>
              </div>
            </header>

            <div className="tabs" role="tablist" aria-label="문화 체험">
              {tabsFor(country).map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  className={`tab ${tab === id ? 'is-active' : ''}`}
                  onClick={() => setTab(id)}
                >
                  <Icon size={isPhone ? 30 : 40} />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            <div className="panel" role="tabpanel">
              {tab === 'greeting' ? <GreetingPanel country={country} /> : <CulturePanel country={country} kind={tab} />}
            </div>

            {isPhone && (
              <div className="modal__footer">
                <button type="button" className="pill-btn" onClick={onPrev}><BackIcon size={22} /> 이전 나라</button>
                <button type="button" className="pill-btn" onClick={onNext}>다음 나라 <NextIcon size={22} /></button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function GreetingPanel({ country }: { country: Country }) {
  const { speak } = useSpeech();
  const g = country.greeting;
  const say = () => speak(g.speakText ?? g.native, g.lang, { fallbackKo: g.pronunciationKo });
  return (
    <div className="greeting">
      <button type="button" className="greeting__bubble" onClick={say} aria-label={`${g.pronunciationKo} 듣기`}>
        <span className="greeting__native" lang={g.lang}>{g.native}</span>
        <span className="greeting__pron">{g.pronunciationKo}</span>
        <span className="greeting__meaning">{g.meaningKo}</span>
      </button>
      <div className="greeting__side">
        <SpeakButton size="lg" label="듣기" onSpeak={say} />
        <p className="greeting__how">{g.how}</p>
      </div>
    </div>
  );
}

function CulturePanel({ country, kind }: { country: Country; kind: CultureKind }) {
  const item = country[kind];
  const credit = creditFor(country.id, kind);
  const [wiggle, setWiggle] = useState(0);
  return (
    <div className="culture">
      <figure className="culture__figure">
        <motion.img
          key={`${country.id}-${kind}`}
          src={imageUrl(country.id, kind)}
          alt={item.name}
          className="culture__img"
          decoding="async"
          draggable={false}
          animate={wiggle ? { rotate: [0, -2.5, 2.5, -1.5, 0] } : {}}
          transition={{ duration: 0.45 }}
          onClick={() => setWiggle((w) => w + 1)}
        />
        {credit && (
          <figcaption className="culture__credit">사진: {credit.author === 'Unknown' ? '작가 미상' : credit.author} · {credit.license} · Wikimedia Commons</figcaption>
        )}
      </figure>
      <div className="culture__text">
        <h3 className="culture__name">{item.name}</h3>
        <p className="culture__desc">{item.description}</p>
      </div>
    </div>
  );
}
