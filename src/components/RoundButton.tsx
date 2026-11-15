import type { ReactNode } from 'react';

interface Props {
  onClick: () => void;
  label: string;
  children: ReactNode;
  caption?: string;
  className?: string;
}

/** 아이 손가락 크기에 맞춘 64px 원형 버튼 (아래에 짧은 글자 표시 가능) */
export function RoundButton({ onClick, label, children, caption, className = '' }: Props) {
  return (
    <button type="button" className={`round-btn ${className}`} onClick={onClick} aria-label={label}>
      <span className="round-btn__face">{children}</span>
      {caption && <span className="round-btn__caption">{caption}</span>}
    </button>
  );
}
