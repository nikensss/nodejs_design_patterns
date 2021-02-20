import { extname } from 'path';
import listNestedFiles from './list_nested_files.js';
import FindRegex from '../chapter3/FindRegex.js';

export default function recursiveFind(directory, keyword, cb) {
  listNestedFiles(directory, (err, files) => {
    if (err) cb(err);

    const result = [];
    const finder = new FindRegex(keyword);
    finder
      .addFiles(files.filter((file) => extname(file) === '.txt'))
      .find()
      .on('find', (file) => result.push(file))
      .on('done', () => cb(null, result))
      .on('error', cb);
  });
}
