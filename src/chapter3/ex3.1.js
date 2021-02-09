import { EventEmitter } from 'events';
import { readFile } from 'fs';

class FindRegex extends EventEmitter {
  #regex;

  #files;

  constructor(regex) {
    super();
    this.#regex = regex;
    this.#files = [];
  }

  addFile(file) {
    this.#files.push(file);
    return this;
  }

  find() {
    this.emit('start', this.#files);
    this.#files.forEach((file) => {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          this.emit('error', err);
          return;
        }

        this.emit('fileread', file);
        const match = content.match(this.#regex);
        if (!match) return;
        match.forEach((e) => this.emit('match', file, e));
      });
    });
    return this;
  }
}

export default FindRegex;
