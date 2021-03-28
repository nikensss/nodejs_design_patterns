import { Transform } from 'stream';
export class FilterByHeight extends Transform {
  constructor(height, options = {}) {
    options.objectMode = true;
    super(options);
    this.height = height;
  }

  _transform(chunk, encoding, done) {
    if (parseFloat(chunk.Height) > this.height) {
      this.push(chunk);
    }
    done(); // indicates we can process another chunk
  }
}
