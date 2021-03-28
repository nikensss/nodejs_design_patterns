import { createHash } from 'crypto';
import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceStream = createReadStream(path.join(__dirname, 'sample.txt'));

sourceStream
  .pipe(createHash('sha1').setEncoding('hex'))
  .pipe(createWriteStream(path.join(__dirname, 'sample.sha1')));

sourceStream
  .pipe(createHash('md5').setEncoding('hex'))
  .pipe(createWriteStream(path.join(__dirname, 'sample.md5')));

sourceStream.on('end', () => console.log('Done!'));

// Notes:
// 1. Using 'pipe' we have backpressure control out-of-the-box

// 1.1. This means if one of the forks blocks the source stream, all pipes will
//    be waiting.

// 2. Piping to additional streams after information starts flowing will not
//    stream the already consumed data

// 2.1. In such cases, we can use a PassThrough instance as a placeholder to
//    buffer all the data until the future streams are ready. But beware of
//    backpressure: if the PassThrough buffer reaches the limit, the entire pipe
//    will block until the PassThrough stream starts delivering data.
