import { Readable } from 'stream';
import Chance from 'chance';

const chance = new Chance();

export class RandomStream extends Readable {
  constructor(options) {
    super(options);
    this.emittedBytes = 0;
  }

  _read(size) {
    const chunk = chance.string({ length: size });
    this.push(chunk, 'utf8');
    this.emittedBytes += chunk.length;
    if (chance.bool({ likelihood: 5 })) {
      this.push(null); // pushing null signals end of data
    }
  }
}

const randomStream = new RandomStream({ highWaterMark: 5 });
randomStream
  .on('data', (d) => console.log(`${d.toString('utf8')}->${d.length} bytes C`))
  .on('end', () => console.log(`Emitted ${randomStream.emittedBytes} bytes`));

let simplerBytesEmitted = 0;
const simplerRandomStream = new Readable({
  highWaterMark: 5,
  read(size) {
    const chunk = chance.string({ length: size });
    this.push(chunk, 'utf8');
    this.emittedBytes += chunk.length;
    if (chance.bool({ likelihood: 5 })) {
      this.push(null); // pushing null signals end of data
    }
  }
});
simplerRandomStream
  .on('data', (d) => {
    simplerBytesEmitted += d.length;
    console.log(`${d.toString('utf8')}->${d.length} bytes S`);
  })
  .on('end', () => console.log(`Emitted ${simplerBytesEmitted} bytes`));
