import { EventEmitter } from 'events';
import { readFile } from 'fs';
import { nextTick } from 'process';

class FindRegex extends EventEmitter {
  #regex;

  #files;

  constructor(regex) {
    super();
    this.#regex = regex;
    this.#files = [];
  }

  addFiles(files) {
    this.#files.push(...files);
    return this;
  }

  addFile(file) {
    this.#files.push(file);
    return this;
  }

  find() {
    nextTick(() => this.emit('start', this.#files));

    this.#files.forEach((file, index, files) => {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          this.emit('error', err);
          return;
        }

        this.emit('fileread', file);
        const match = content.match(this.#regex);
        if (match) {
          match.forEach((e) => this.emit('find', file, e));
        }
        if (index === files.length - 1) this.emit('done');
      });
    });

    return this;
  }
}

export default FindRegex;
