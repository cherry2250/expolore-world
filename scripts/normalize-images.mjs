// .image-cache/ 의 원본을 모두 같은 규격(800×600, JPEG)으로 만들어 public/images 에 저장합니다.
// - 가로 사진(비율 1.2~1.8): 중요한 부분을 자동으로 찾아 4:3으로 자름
// - 세로 사진·아주 긴 사진: 잘리지 않게 전체를 넣고, 남는 공간은 같은 사진을 흐리게 깔아 채움
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE = path.join(ROOT, '.image-cache');
const OUT = path.join(ROOT, 'public/images');
const W = 800, H = 600;

for (const country of await fs.readdir(CACHE)) {
  const dir = path.join(CACHE, country);
  if (!(await fs.stat(dir)).isDirectory()) continue;
  await fs.mkdir(path.join(OUT, country), { recursive: true });
  for (const file of await fs.readdir(dir)) {
    const src = path.join(dir, file);
    const dst = path.join(OUT, country, file.replace(/\.\w+$/, '.jpg'));
    const img = sharp(src).rotate();
    const { width = 1, height = 1 } = await img.metadata();
    const r = width / height;
    let out;
    if (r >= 1.2 && r <= 1.8) {
      out = img.resize(W, H, { fit: 'cover', position: sharp.strategy.attention });
    } else {
      const bg = await sharp(src).rotate().resize(W, H, { fit: 'cover' }).blur(28).modulate({ brightness: 0.92 }).toBuffer();
      const fg = await sharp(src).rotate().resize(W, H, { fit: 'inside' }).toBuffer();
      out = sharp(bg).composite([{ input: fg, gravity: 'center' }]);
    }
    await out.jpeg({ quality: 76, mozjpeg: true }).toFile(dst);
    console.log(`${r >= 1.2 && r <= 1.8 ? 'crop' : 'fill'} ${country}/${file} (${width}×${height})`);
  }
}
