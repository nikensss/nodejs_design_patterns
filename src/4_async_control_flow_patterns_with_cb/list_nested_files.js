import { readdir } from 'fs';
import { resolve } from 'path';

export default function listNestedFiles(dir, cb) {
  const filesFound = [];
  let dirs = 1;

  const accumulate = (root) => {
    return (err, files) => {
      if (err) return cb(err);

      filesFound.push(...files.map((f) => resolve(root, f.name)));

      files
        .filter((file) => file.isDirectory())
        .map((directory) => resolve(root, directory.name))
        .forEach((path) => {
          dirs += 1;
          readdir(path, { withFileTypes: true }, accumulate(path));
        });

      dirs -= 1;

      if (dirs === 0) return cb(null, filesFound);

      return dirs;
    };
  };

  readdir(dir, { withFileTypes: true }, accumulate(dir));
}
