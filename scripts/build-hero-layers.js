/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * hero.png tek bir düz fotoğraf (terazi ayrı bir katman olarak gelmedi).
 * Hero animasyonunun "sadece kefe kolları döner, direk/kaide sabit kalır"
 * gereksinimini karşılamak için tek fotoğraftan iki katman türetiyoruz:
 *
 *  - hero-base.png        → değişmeyen statik arka plan (orijinal foto, aynen)
 *  - hero-scale-beam.png  → sadece kiriş+zincir+kefeler, feathered alpha
 *                            mask ile kesildi (post/kaide/mimari HARİÇ),
 *                            components/hero-scale.tsx'te bu katman
 *                            base'in üzerine TAM AYNI pikselde bindirilip
 *                            CSS transform-origin ile üst pivottan döndürülür.
 *
 * Kırpma kutusu ve pivot yüzdeleri hero-scale.tsx içindeki BEAM_BOX /
 * PIVOT_ORIGIN sabitleriyle birebir eşleşmeli — kaynak fotoğraf değişirse
 * bu sabitler de yeniden hesaplanmalı.
 *
 * Kullanım: node scripts/build-hero-layers.js /path/to/kaynak-hero.png
 */
const sharp = require('sharp');
const path = require('path');

const SRC = process.argv[2];
if (!SRC) {
  console.error('Kullanım: node scripts/build-hero-layers.js <kaynak-hero.png>');
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, '..', 'public');

// Orijinal fotoğraf 1536x1024. Kiriş+zincir+kefeleri saran kutu.
const CROP = { left: 800, top: 360, width: 660, height: 660 };

async function main() {
  const cropBuffer = await sharp(SRC).extract(CROP).png().toBuffer();

  // Kutunun ortasından geçen dikey post/direk şeridini maskeden çıkar
  // (yumuşak/bulanık kenarla) — böylece dönen katman post pikseli taşımaz,
  // post her zaman statik base katmandan görünür.
  const maskSvg = `
    <svg width="${CROP.width}" height="${CROP.height}" xmlns="http://www.w3.org/2000/svg">
      <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="38" />
      </filter>
      <filter id="soft2" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="26" />
      </filter>
      <mask id="postGap">
        <rect x="0" y="0" width="${CROP.width}" height="${CROP.height}" fill="white" />
        <rect x="270" y="0" width="90" height="${CROP.height}" fill="black" filter="url(#soft2)" />
      </mask>
      <ellipse cx="320" cy="250" rx="295" ry="195" fill="white" filter="url(#soft)" mask="url(#postGap)" />
    </svg>
  `;
  const maskBuffer = await sharp(Buffer.from(maskSvg)).png().toBuffer();

  const beamLayer = await sharp(cropBuffer)
    .composite([{ input: maskBuffer, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp(beamLayer).toFile(path.join(OUT_DIR, 'hero-scale-beam.png'));
  await sharp(SRC).toFile(path.join(OUT_DIR, 'hero-base.png'));

  console.log('Yazıldı: public/hero-base.png, public/hero-scale-beam.png');
  console.log('Kırpma kutusu:', CROP);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
