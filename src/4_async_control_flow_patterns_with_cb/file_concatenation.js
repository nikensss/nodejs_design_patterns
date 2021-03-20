import { readFile, writeFile } from 'fs';

export default function concatFiles(...args) {
  const cb = args.pop();
  const destination = args.pop();
  const sourceFiles = args;

  const result = [];

  const accumulateResult = (err, data) => {
    if (err) return cb(err);

    result.push(data);

    if (sourceFiles.length > 0) {
      return readFile(sourceFiles.shift(), accumulateResult);
    }

    return writeFile(destination, result.join(''), cb);
  };

  readFile(sourceFiles.shift(), accumulateResult);
}
