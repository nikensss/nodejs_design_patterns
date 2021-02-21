import { EventEmitter } from 'events';
import { readFile } from 'fs';
import { nextTick } from 'process';

class FindRegex extends EventEmitter {
  #regex;

  #files;

  #scanned;

  constructor(regex) {
    super();
    this.#regex = regex;
    this.#files = [];
    this.#scanned = [];
  }

  addFiles(files) {
    this.#files.push(...files);
    return this;
  }

  addFile(file) {
    this.#files.push(file);
    return this;
  }

  isAllFilesScanned() {
    return (
      this.#files.length === this.#scanned.length &&
      this.#files.every((f) => this.#scanned.includes(f))
    );
  }

  find() {
    this.#scanned = [];
    nextTick(() => this.emit('start', this.#files));
    this.#files.forEach((file) => {
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
        this.#scanned.push(file);
        if (this.isAllFilesScanned()) this.emit('done');
      });
    });

    return this;
  }
}

export default FindRegex;
