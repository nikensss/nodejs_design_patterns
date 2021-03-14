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
const p4 = new Promise((res, rej) =>
  setTimeout(rej, 1220, new Error('Expected rejection!'))
);

promiseAll([p1, null, p2, undefined, p3, -4, p4])
  .then((r) => console.log({ r }))
  .catch((er) => console.log({ er }));
promiseAll([p1, null, p2, undefined, p3, -4]).then((r) => console.log({ r }));
promiseAll([]).then((r) => console.log({ r }));
