/* eslint-disable no-console */
import FindRegex from './chapter3/ex3.1.js';

const findRegex = new FindRegex('if');

console.log('Starting!');

const a = [1, 2, 3, 4, 5];
for (const number of a) {
  console.log(number);
}

findRegex
  .addFile('./src/chapter3/sample1.txt')
  .addFile('./src/chapter3/sample2.txt')
  .find()
  .on('start', (files) => console.log(`Looking through files: ${files}`))
  .on('fileread', (file) => console.log(`File read: ${file}`))
  .on('match', (file, match) => console.log(`Found '${match}' at ${file}`))
  .on('error', (err) => console.error(err));

console.log('Done!');
