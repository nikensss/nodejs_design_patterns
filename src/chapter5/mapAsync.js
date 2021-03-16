export const mapAsync = async (array, callback, concurrency) => {
  if (array.length === 0) return array;
  const result = [];
  const taskQueue = [];
  const consumerQueue = [];

  const consumer = async (id) => {
    try {
      console.log(`[${id}] Thread waiting...`);
      const task = await getNextTask();
      console.log(`[${id}] Task received!`);
      await task();
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

  const promises = [];
  for (let index = 0; index < array.length; index++) {
    ((i) =>
      promises.push(
        enqueueTask(() => callback(array[index], index, array))
          .then((res) => {
            console.log(`Assigning ${res} to element ${i}`);
            result[i] = res;
          })
          .catch((ex) => {
            console.log(`Promise rejected: ${ex}`);
            result[i] = null;
          })
      ))(index);
  }

  await Promise.all(promises);

  return result;
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
      n + 0.1
    );
  });
};
mapAsync(data, cb, 2).then((r) => console.log({ r }));
