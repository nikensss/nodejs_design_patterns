const promiseAll = async (promises) => {
  // eslint-disable-next-line consistent-return
  if (promises.length === 0) {
    return [];
  }
  const result = [];
  for (const p of promises) {
    // eslint-disable-next-line no-await-in-loop
    result.push(await Promise.resolve(p));
  }
  return result;
};
export default promiseAll;

const p1 = Promise.resolve(3);
const p2 = 42;
const p3 = new Promise((resolve) => {
  setTimeout(resolve, 100, 'foo');
});
// const p4 = Promise.reject(new Error('expected rejection!'));

promiseAll([p1, null, p2, undefined, p3, -4]).then((r) => console.log({ r }));
promiseAll([
  p1,
  null,
  p2,
  undefined,
  p3,
  -4,
  Promise.reject(new Error('expected rejection!'))
])
  .then((r) => console.log({ r }))
  .catch((er) => console.log({ er }));
promiseAll([]).then((r) => console.log({ r2: r }));
