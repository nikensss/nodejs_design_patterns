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
    if (Date.now() % 5 === 0) {
      this.emit('error', new Error('Time divisible by 5!'));
      this.#cb(new Error('Time divisible by 5!'));
      return;
    }
    this.emit('tick');
    this.#ticks += 1;
  }

  start() {
    this.#ticks = 0;
    setImmediate(this.tick.bind(this));
    const interval = setInterval(this.tick.bind(this), 50);
    setTimeout(() => {
      clearInterval(interval);
      this.#cb(null, this.#ticks);
    }, this.#milliseconds);

    return this;
  }
}

export default function createTicker(milliseconds, cb) {
  const ticker = new Ticker(milliseconds, cb);
  return ticker.start();
}
