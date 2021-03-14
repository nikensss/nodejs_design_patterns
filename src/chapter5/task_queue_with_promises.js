export default class TaskQueue {
  #queue;

  #running;

  #concurrency;

  constructor(concurrency = 4) {
    this.#queue = [];
    this.#concurrency = concurrency;
    this.#running = 0;
  }

  get concurrency() {
    return this.#concurrency;
  }

  next() {
    while (this.#running < this.#concurrency && this.#queue.length) {
      const task = this.#queue.shift();
      task().finally(() => {
        this.#running -= 1;
        this.next();
      });
      this.#running += 1;
    }
  }

  runTask(task) {
    return new Promise((res, rej) => {
      this.#queue.push(async () => {
        try {
          res(await task());
        } catch (ex) {
          rej(ex);
        }
      });
      process.nextTick(() => this.next());
    });
  }
}
