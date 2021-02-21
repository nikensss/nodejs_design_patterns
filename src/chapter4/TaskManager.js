import EventEmitter from 'events';

export default class TaskManager extends EventEmitter {
  #queue;

  constructor(concurrency = 2) {
    super();
    if (concurrency <= 0) {
      throw new Error('Concurrency must be at least 1!');
    }

    this.#queue = [];
    this.concurrency = concurrency;
    this.running = 0;
  }

  addTask(task) {
    this.#queue.push(task);
    this.next();
  }

  isEmpty() {
    return this.#queue.length === 0;
  }

  next() {
    if (this.isEmpty() && this.running === 0) {
      this.emit('empty');
      return;
    }

    while (this.running < this.concurrency && !this.isEmpty()) {
      const task = this.#queue.shift();
      task((err) => {
        if (err) this.emit('error', err);
        this.running -= 1;
        process.nextTick(() => this.next());
      });
      this.running += 1;
    }
  }
}
