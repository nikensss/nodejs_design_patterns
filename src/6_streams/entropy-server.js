import { createServer } from 'http';
import Chance from 'chance';

const chance = new Chance();
const server = createServer((req, res) => {
  setImmediate(() => console.log('next tick'));
  res.on('finish', () => console.log('All data sent!'));
  process.nextTick(() => console.log('end of first tick'));

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  while (chance.bool({ likelihood: 95 })) {
    res.write(`${chance.string()}\n`);
  }
  process.nextTick(() => console.log('second next tick callback registered'));
  res.end('\n\n');
});

server.listen(8080, () => {
  console.log('Listening on http://localhost:8080');
});

const backPressuredServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  function generateMore() {
    while (chance.bool({ likelihood: 95 })) {
      const randomChunk = chance.string({ length: 16 * 1024 - 1 });
      const shouldContinue = res.write(`${randomChunk}\n`);
      if (!shouldContinue) {
        console.log('back-pressure!');
        return res.once('drain', generateMore);
      }
    }
    res.end('\n\n');
  }
  generateMore();
  res.on('finish', () => console.log('All data sent!'));
});

backPressuredServer.listen(8081, () => {
  console.log('Listening on http://localhost:8080');
});
