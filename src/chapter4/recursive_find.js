import { extname } from 'path';
import listNestedFiles from './list_nested_files.js';
import FindRegex from '../chapter3/FindRegex.js';
import TaskManager from './TaskManager.js';

export default function recursiveFind(directory, keyword, cb) {
  listNestedFiles(directory, (err, files) => {
    if (err) return cb(err);

    const result = [];
    return new FindRegex(keyword)
      .addFiles(files.filter((file) => extname(file) === '.txt'))
      .find()
      .on('find', (file) => result.push(file))
      .on('done', () => cb(null, result))
      .on('error', cb);
  });
}

export function recursiveFindConcurrent(directory, keyword, cb) {
  const result = [];
  const tm = new TaskManager(4)
    .on('error', (err) => cb(err))
    .on('empty', () => cb(null, result));

  listNestedFiles(directory, (err, files) => {
    if (err) return cb(err);

    return files
      .filter((file) => extname(file) === '.txt')
      .forEach((txt) => {
        return tm.addTask((done) => {
          new FindRegex(keyword)
            .addFile(txt)
            .find()
            .on('find', (file) => result.push(file))
            .on('done', done)
            .on('error', done);
        });
      });
  });
}
