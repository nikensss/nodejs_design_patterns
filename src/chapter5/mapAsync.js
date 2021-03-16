export const mapAsync = async (array, callback, concurrency = 4) => {
  if (array.length === 0) return array;
  const taskQueue = [];
  const consumerQueue = [];

  const consumer = async (id) => {
    try {
      console.log(`[${id}] Thread waiting...`);
      const task = await getNextTask();
      console.log(`[${id}] Task received!`);
      await task();
      console.log(`[${id}]Task finished!`);
    } catch (ex) {
      console.error(ex);
    } finally {
      consumer(id);
    }
  };

  const getNextTask = () => {
    return new Promise((res) => {
      if (taskQueue.length !== 0) {
        return res(taskQueue.shift());
      }
      consumerQueue.push(res);
    });
  };

  const enqueueTask = (task) => {
    return new Promise((res, rej) => {
      const wrapper = () => Promise.resolve(task()).then(res, rej);

      // if a 'thread' is sleeping, there will be a 'resolve' method in the
      // 'consumerQueue' that we can call to resolve to a new task, so
      // 'getNextTask' finally resolves and the 'consumer' method moves on after
      // the 'await'
      if (consumerQueue.length !== 0) {
        const consumer = consumerQueue.shift();
        return consumer(wrapper);
      }
      taskQueue.push(wrapper);
    });
  };

  for (let index = 0; index < concurrency; index++) {
    consumer(index);
  }

  const promises = array.map((e, i, a) =>
    enqueueTask(() => callback(e, i, a)).catch(() => null)
  );

  return await Promise.all(promises);
};

const data = [1, 2, 3, 4, 5];
const cb = function (n) {
  return new Promise((res, rej) => {
    setTimeout(
      (r) => {
        console.log(`Resolving to: ${r}`);
        if (Date.now() % 2 === 0) {
          return rej(new Error('rejecting'));
        }
        res(r);
      },
      647,
      n * 2
    );
  });
};
mapAsync(data, cb, 3).then((r) => console.log({ r }));
