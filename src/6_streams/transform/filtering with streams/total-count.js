import { Transform } from 'stream';

export class TotalCount extends Transform {
  constructor(options = {}) {
    options.objectMode = true;
    super(options);
    this.count = 0;
  }

  _transform(chunk, encoding, done) {
    this.count += 1;
    done();
  }

  _flush(done) {
    this.push(this.count.toString());
    done();
  }
}
