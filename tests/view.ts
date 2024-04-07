import parser from '../src/parser';
import fs from 'node:fs';
import { join } from 'path';

const path = join(__dirname, 'sample-1.md');
const file = fs.readFileSync(path, 'utf8');
const tree = parser(file);

console.log(
  JSON.stringify(tree, null, '  ')
);
