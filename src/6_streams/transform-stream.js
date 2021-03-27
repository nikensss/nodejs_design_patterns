import { Transform } from 'stream';

const tails = [];
export class ReplaceStream extends Transform {
  constructor(searchStr, replaceStr, options) {
    super(options);
    this.searchStr = searchStr;
    this.replaceStr = replaceStr;
    this.tail = '';
  }

  _transform(chunk, encoding, cb) {
    const pieces = `${this.tail}${chunk}`.split(this.searchStr);
    const lastPiece = pieces.pop();
    const tailLen = this.searchStr.length - 1;
    this.tail = lastPiece.slice(-tailLen);
    tails.push({ tail: this.tail });
    pieces.push(lastPiece.slice(0, -tailLen));
    this.push(pieces.join(this.replaceStr));
    cb();
  }

  _flush(cb) {
    this.push(this.tail);
    cb();
  }
}

const replaceStream = new ReplaceStream('World', 'NodeJS');
// replaceStream.on('data', (chunk) => console.log(chunk.toString()));

replaceStream.write('Hello Wo');
replaceStream.write('rld!');
replaceStream.end();
replaceStream.pipe(process.stdout);
console.log({ tails });
tails.length = 0;

const searchStr = 'World';
const replaceStr = 'NodeJS';
let tail = '';
const simplifiedReplaceStream = new Transform({
  transform(chunk, encoding, cb) {
    const pieces = `${tail}${chunk}`.split(searchStr);
    const lastPiece = pieces.pop();
    const tailLen = searchStr.length - 1;
    tail = lastPiece.slice(-tailLen);
    tails.push({ tail: tail });
    pieces.push(lastPiece.slice(0, -tailLen));
    this.push(pieces.join(replaceStr));
    cb();
  },
  flush(cb) {
    this.push(tail);
    cb();
  }
});

simplifiedReplaceStream.write('Hello Wo');
simplifiedReplaceStream.write('rld!');
simplifiedReplaceStream.end();
simplifiedReplaceStream.pipe(process.stdout);
console.log({ tails });
