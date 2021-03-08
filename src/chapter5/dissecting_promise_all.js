const promiseAll = async (promises) => {
  return new Promise((res, rej) => {
    if (promises.length === 0) {
      res();
      return;
    }

    let count = 0;
    const results = [];
    promises.map((p, i) =>
      Promise.resolve(p)
        .then((r) => {
          results[i] = r;
          count += 1;
          if (count === promises.length) {
            res(results);
          }
        })
        .catch((ex) => rej(ex))
    );
  });
};
export default promiseAll;

const p1 = Promise.resolve(3);
const p2 = 42;
const p3 = new Promise((resolve) => {
  setTimeout(resolve, 100, 'foo');
});
const p4 = Promise.reject(new Error('rejected!'));

promiseAll([p1, null, p2, undefined, p3, -4]).then((r) => console.log({ r }));
promiseAll([p1, null, p2, undefined, p3, -4, p4])
  .then((r) => console.log({ r }))
  .catch((er) => console.log({ er }));
promiseAll([]).then((r) => console.log({ r }));
