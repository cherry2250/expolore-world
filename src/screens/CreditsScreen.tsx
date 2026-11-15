import { useNavigate } from 'react-router-dom';
import { continents } from '../data/continents';
import { countryById } from '../data/countries';
import { creditFor } from '../lib/assets';
import { RoundButton } from '../components/RoundButton';
import { BackIcon } from '../components/icons';

const KIND_LABEL = { food: '음식', landmark: '명소', highlight: '' } as const;
const HIGHLIGHT_LABEL = { costume: '의상', animal: '동물', music: '음악' } as const;

/** 보호자·선생님용: 사진 저작자와 라이선스 */
export function CreditsScreen() {
  const navigate = useNavigate();
  return (
    <div className="screen credits">
      <header className="credits__header">
        <RoundButton label="세계 지도로 돌아가기" onClick={() => navigate('/')}><BackIcon /></RoundButton>
        <h1>사진 출처</h1>
      </header>
      <div className="credits__body">
        <p className="credits__intro">
          지도: Natural Earth (퍼블릭 도메인). 국기: flag-icons (MIT). 사진은 모두 Wikimedia Commons의 자유 라이선스 이미지이며,
          크기를 줄여 사용했습니다.
        </p>
        {continents.map((ct) => (
          <section key={ct.id}>
            <h2>{ct.nameKo}</h2>
            <ul>
              {ct.countryIds.flatMap((id) =>
                (['food', 'landmark', 'highlight'] as const).map((k) => {
                  const cr = creditFor(id, k);
                  const c = countryById[id];
                  return (
                    <li key={`${id}-${k}`}>
                      <b>{c.nameKo} · {k === 'highlight' ? HIGHLIGHT_LABEL[c.highlight.kind] : KIND_LABEL[k]} · {c[k].name}</b>
                      {cr ? (
                        <span> — {cr.author === 'Unknown' ? '작가 미상' : cr.author} · {cr.license} · <a href={cr.source} target="_blank" rel="noreferrer">원본</a></span>
                      ) : (
                        <span> — 출처 정보 없음</span>
                      )}
                    </li>
                  );
                }),
              )}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
