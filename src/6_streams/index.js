// process.stdin
//   .on('readable', () => {
//     let chunk;
//     while ((chunk = process.stdin.read()) !== null) {
//       console.log('new data available');
//       console.log(`Chunk read (${chunk.length} bytes):\n'${chunk}'`);
//     }
//   })
//   .on('end', () => {
//     clearInterval(interval);
//     console.log('end of stream');
//   });

// const interval = setInterval(() => console.log('tick'), 1000);

// process.stdin
//   .on('data', (chunk) => {
//     console.log('new data available');
//     console.log(`Chunk read (${chunk.length} bytes):\n'${chunk}'`);
//   })
//   .on('end', () => console.log('end of stream'));

process.stdin
  .on('data', (chunk) => {
    console.log('New data available');
    console.log(`Chunk read (${chunk.length} bytes):\n'${chunk}'`);
    console.log('End of chunk!');
  })
  .pipe(process.stdout)
  .on('end', () => console.log('end of stream'));
