/* eslint-disable no-console */
// import FindRegex from './chapter3/FindRegex.js';
// import createTicker from './chapter3/Ticker.js';
// import concatFiles from './chapter4/file_concatenation.js';
// import listNestedFiles from './chapter4/list_nested_files.js';

import recursiveFind from './chapter4/recursive_find.js';

// console.log('Starting!');
// const findRegex = new FindRegex(/her/g);

// findRegex
//   .addFile('./src/chapter3/sample1.txt')
//   .addFile('./src/chapter3/sample2.txt')
//   .find()
//   .on('start', (files) => console.log(`Looking through files: ${files}`))
//   .on('fileread', (file) => console.log(`File read: ${file}`))
//   .on('find', (file, match) => console.log(`Found '${match}' at ${file}`))
//   .on('error', (err) => console.error(err));

// createTicker(201, (err, ticks) => {
//   if (err) {
//     console.error(`In callback:   ${err}`);
//     return;
//   }
//   console.log(`Done! Ticked a total amount of ${ticks} times`);
// })
//   .on('tick', () => console.log('Ticked!'))
//   .on('error', (error) => console.error(`Error emitted: ${error}`));

// concatFiles(
//   './src/chapter4/first.txt',
//   './src/chapter4/second.txt',
//   './src/chapter4/third.txt',
//   './src/chapter4/result.txt',
//   (err) => {
//     if (err) {
//       throw new Error(err);
//     }

//     console.log('1. Files concatenated');
//   }
// );
// concatFiles(
//   './src/chapter4/second.txt',
//   './src/chapter4/third.txt',
//   './src/chapter4/first.txt',
//   './src/chapter4/result2.txt',
//   (err) => {
//     if (err) {
//       throw new Error(err);
//     }

//     console.log('2. Files concatenated');
//   }
// );

// listNestedFiles('src', (err, files) => {
//   if (err) throw err;

//   console.log(`Found ${files.length} files.`);
//   console.log({ files });
// });

recursiveFind('src', 'her', (err, files) => {
  if (err) return console.error(err);

  console.log(`Files containing "her": \n${files.join('\n')}`);
  return 1;
});

console.log('Done!');
