import sharp from 'sharp';

const BG = '#000d0d';
const SRC = 'public/logo.png';

async function gerar(tamanho, saida, safeZoneScale) {
  const lado = Math.round(tamanho * safeZoneScale);
  const conteudo = await sharp(SRC)
    .resize(lado, lado, { fit: 'contain', background: BG })
    .toBuffer();

  await sharp({
    create: { width: tamanho, height: tamanho, channels: 4, background: BG },
  })
    .composite([{ input: conteudo, gravity: 'center' }])
    .png()
    .toFile(saida);

  console.log('gerado', saida);
}

await gerar(512, 'public/icon-512.png', 0.72);
await gerar(192, 'public/icon-192.png', 0.72);
await gerar(180, 'public/apple-touch-icon.png', 0.8);
