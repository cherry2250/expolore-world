// scripts/image-sources.json 에 적힌 Wikimedia Commons 파일(또는 위키백과 문서 대표 이미지)을
// .image-cache/ 에 1200px로 받고, 저작자·라이선스를 src/data/credits.json 에 기록합니다.
// 이후 `node scripts/normalize-images.mjs` 로 public/images 에 800×600 규격 이미지를 만듭니다.
// 사용: node scripts/fetch-images.mjs            → 캐시에 없는 항목만
//       node scripts/fetch-images.mjs --all      → 전부 다시 받기
//       node scripts/fetch-images.mjs korea/food → 특정 항목만
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.image-cache');
const UA = 'WorldExplorerKids/0.1 (educational static site)';
const sources = JSON.parse(await fs.readFile(path.join(ROOT, 'scripts/image-sources.json'), 'utf8'));
const creditsPath = path.join(ROOT, 'src/data/credits.json');
const args = process.argv.slice(2);
const all = args.includes('--all');
const only = args.filter((a) => !a.startsWith('--'));
const prev = JSON.parse(await fs.readFile(creditsPath, 'utf8').catch(() => '{}'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const chunk = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
const exists = (p) => fs.access(p).then(() => true, () => false);

async function get(url, tries = 6) {
  for (let i = 0; i < tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.status !== 429 && res.status < 500) return res;
    await sleep(2000 * 2 ** i);
  }
  throw new Error(`gave up: ${url}`);
}
const api = async (host, params) =>
  (await get(`https://${host}/w/api.php?` + new URLSearchParams({ format: 'json', formatversion: '2', ...params }))).json();

// 1) 받을 항목
const jobs = [];
for (const [country, slots] of Object.entries(sources))
  for (const [slot, src] of Object.entries(slots)) {
    const key = `${country}/${slot}`;
    const cached = await exists(path.join(CACHE, country, `${slot}.jpg`));
    const sameFile = prev[key] && src === `File:${prev[key].file}`;
    if (only.length ? only.includes(key) : all || !cached || !sameFile) jobs.push({ key, src, file: src.startsWith('File:') ? src : null });
  }

// 2) 문서 제목이면 대표 이미지 파일명 찾기
for (const group of chunk(jobs.filter((j) => !j.file), 50)) {
  const r = await api('en.wikipedia.org', { action: 'query', titles: group.map((j) => j.src).join('|'), prop: 'pageimages', piprop: 'name', redirects: '1' });
  const alias = {};
  for (const n of [...(r.query.normalized || []), ...(r.query.redirects || [])]) alias[n.from] = n.to;
  const byTitle = Object.fromEntries(r.query.pages.map((p) => [p.title, p.pageimage]));
  for (const j of group) { let t = j.src; while (alias[t]) t = alias[t]; if (byTitle[t]) j.file = `File:${byTitle[t]}`; }
  await sleep(1000);
}

// 3) Commons 라이선스 정보 (Commons에 없는 파일 = 비자유 이미지일 수 있어 제외)
const info = {};
const norm = (t) => t.replace(/_/g, ' ');
for (const group of chunk([...new Set(jobs.filter((j) => j.file).map((j) => j.file))], 50)) {
  const r = await api('commons.wikimedia.org', { action: 'query', titles: group.join('|'), prop: 'imageinfo', iiprop: 'url|extmetadata|mime', iiurlwidth: '1200' });
  for (const p of r.query.pages) {
    if (p.missing || !p.imageinfo) continue;
    const ii = p.imageinfo[0], m = ii.extmetadata || {};
    info[norm(p.title)] = { thumb: ii.thumburl, page: ii.descriptionurl, mime: ii.mime,
      author: strip(m.Artist?.value) || 'Unknown', license: m.LicenseShortName?.value || 'see source' };
  }
  await sleep(1000);
}

// 4) 다운로드
const credits = { ...prev };
for (const j of jobs) {
  const i = j.file && info[norm(j.file)];
  if (!i || !/image\/(jpeg|png|webp|tiff)/.test(i.mime)) { console.log(`✗ ${j.key} ← ${j.file ?? j.src}`); continue; }
  const out = path.join(CACHE, ...j.key.split('/')) + '.jpg';
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, Buffer.from(await (await get(i.thumb)).arrayBuffer()));
  credits[j.key] = { file: j.file.replace(/^File:/, ''), author: i.author, license: i.license, source: i.page };
  console.log(`✓ ${j.key} ← ${j.file} [${i.license}]`);
  await sleep(700);
}

// image-sources.json 에 없는 옛 항목은 정리
for (const k of Object.keys(credits)) { const [c, s] = k.split('/'); if (!sources[c]?.[s]) delete credits[k]; }
const sorted = Object.fromEntries(Object.keys(credits).sort().map((k) => [k, credits[k]]));
await fs.writeFile(creditsPath, JSON.stringify(sorted, null, 2) + '\n');
