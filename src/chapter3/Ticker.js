import { EventEmitter } from 'events';

class Ticker extends EventEmitter {
  #milliseconds;

  #cb;

  #ticks;

  constructor(milliseconds, cb) {
    super();
    this.#milliseconds = milliseconds;
    this.#cb = cb;
    this.#ticks = 0;
  }

  tick() {
    this.#ticks += 1;
    if (Date.now() % 5 === 0) {
      this.emit('error', new Error('Time divisible by 5!'));
      this.#cb(new Error('Time divisible by 5!'));
      return;
    }
    this.emit('tick');
  }

  start() {
    this.#ticks = 0;
    const start = Date.now();
    const end = start + this.#milliseconds;

    setImmediate(() => this.tick());

    const recursiveTick = () => {
      if (end < Date.now()) {
        setImmediate(() => this.#cb(null, this.#ticks));
        return;
      }

      if (end - Date.now() < 50) {
        setTimeout(() => this.#cb(null, this.#ticks), end - Date.now());
        return;
      }

      this.tick();
      setTimeout(recursiveTick, 50);
    };

    setTimeout(recursiveTick, 50);

    return this;
  }
}

export default function createTicker(milliseconds, cb) {
  const ticker = new Ticker(milliseconds, cb);
  return ticker.start();
}
