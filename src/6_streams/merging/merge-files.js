import { promises as fs, createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import split from 'split';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dest = 'merged.txt';
const sources = await getSources();

const destStream = createWriteStream(path.join(__dirname, dest));
destStream.on('end', () => console.log('Merge finished!'));

let endCount = 0;
for (const source of sources) {
  const sourceStream = createReadStream(source, { highWaterMark: 1 });
  sourceStream.on('end', () => {
    if (endCount === sources.length) {
      destStream.end();
    }
  });
  sourceStream.pipe(split((l) => `${l}\n`)).pipe(destStream, { end: false });
}

async function getSources() {
  const files = await fs.readdir(path.join(__dirname, 'sources'));
  return files.map((f) => path.resolve(__dirname, 'sources', f));
}
