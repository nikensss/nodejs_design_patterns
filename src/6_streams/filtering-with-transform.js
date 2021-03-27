import { createReadStream } from 'fs';
import parse from 'csv-parse';
import { FilterByHeight } from './filter-by-height.js';
import { TotalCount } from './total-count.js';

const csvParser = parse({ columns: true, trim: true });

createReadStream('data.csv')
  .pipe(csvParser)
  .pipe(new FilterByHeight(71))
  .pipe(new TotalCount())
  .pipe(process.stdout);
