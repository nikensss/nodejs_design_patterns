import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { Writable } from 'stream';

export class ToFileStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _write(chunk, encoding, cb) {
    fs.mkdir(dirname(chunk.path), { recursive: true })
      .then(() => console.log(`Path ${chunk.path} created!`))
      .then(() => fs.writeFile(chunk.path, chunk.content))
      .then(() => cb())
      .catch(cb);
  }
}

const tfs = new ToFileStream();
tfs.write({ path: join('files', 'file1.txt'), content: 'Hello' });
tfs.write({ path: join('files', 'file2.txt'), content: 'NodeJS' });
tfs.write({ path: join('files', 'file3.txt'), content: 'streams' });
tfs.end(() => console.log('All files created!'));
