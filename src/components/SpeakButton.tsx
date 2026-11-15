import { SpeakerIcon } from './icons';

interface Props {
  onSpeak: () => void;
  label?: string;
  size?: 'md' | 'lg';
}

export function SpeakButton({ onSpeak, label = '듣기', size = 'md' }: Props) {
  return (
    <button type="button" className={`speak-btn speak-btn--${size}`} onClick={onSpeak} aria-label={label}>
      <SpeakerIcon size={size === 'lg' ? 36 : 28} />
      {size === 'lg' && <span>{label}</span>}
    </button>
  );
}
