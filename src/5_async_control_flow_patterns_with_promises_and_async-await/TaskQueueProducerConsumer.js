// eslint-disable-next-line max-classes-per-file
export default class TaskQueueProducerConsumer {
  constructor(concurrency = 1) {
    this.taskQueue = [];
    this.consumerQueue = [];

    for (let i = 0; i < concurrency; i += 1) {
      this.consumer();
    }
  }

  async consumer() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const task = await this.getNextTask();
        await task();
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  async getNextTask() {
    return new Promise((res) => {
      if (this.taskQueue.length !== 0) {
        return res(this.taskQueue.shift());
      }

      this.consumerQueue.push(res);
    });
  }

  runTask(task) {
    return new Promise((res, rej) => {
      const taskWrapper = () => {
        const taskPromise = task();
        taskPromise.then(res, rej);
        return taskPromise;
      };

      if (this.consumerQueue.length !== 0) {
        const consumer = this.consumerQueue.shift();
        consumer(taskWrapper);
      } else {
        this.taskQueue.push(taskWrapper);
      }
    });
  }
}

export class TaskQueueProducerConsumerPromises {
  constructor(concurrency = 1) {
    this.taskQueue = [];
    this.consumerQueue = [];

    for (let i = 0; i < concurrency; i += 1) {
      this.consumer();
    }
  }

  consumer() {
    this.getNextTask()
      .then((task) => task())
      .then(() => this.consumer())
      .catch((err) => console.log(err));
  }

  getNextTask() {
    // eslint-disable-next-line consistent-return
    return new Promise((res) => {
      if (this.taskQueue.length !== 0) {
        return res(this.taskQueue.shift());
      }

      this.consumerQueue.push(res);
    });
  }

  runTask(task) {
    return new Promise((res, rej) => {
      const taskWrapper = () => {
        const taskPromise = task();
        taskPromise.then(res, rej);
        return taskPromise;
      };

      if (this.consumerQueue.length !== 0) {
        const consumer = this.consumerQueue.shift();
        consumer(taskWrapper);
      } else {
        this.taskQueue.push(taskWrapper);
      }
    });
  }
}
