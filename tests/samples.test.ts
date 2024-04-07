import { describe, expect, it } from '@jest/globals';
import { parse } from '../src';
import fs from 'node:fs';
import { join } from 'path';

/**
 * Read Sample Files
 */
function readSample(name: string): { md: string, json: any } {
  const mdPath = join(__dirname, `${name}.md`);
  const mdText = fs.readFileSync(mdPath, 'utf8');
  const jsonPath = join(__dirname, `${name}.json`);
  const jsonText = fs.readFileSync(jsonPath, 'utf8');

  return {
    md: mdText,
    json: JSON.parse(jsonText)
  }
}

// ----------------------------------------------------------------

describe('parse sample files', () => {

  it('parses sample 1', () => {
    const { md, json } = readSample('sample-1');
    expect(parse(md)).toEqual(json);
  });

  it('parses sample 4', () => {
    const { md, json } = readSample('sample-4');
    expect(parse(md)).toEqual(json);
  });

  // it('parses sample 2', () => {
  //   const { md, json } = readSample('sample-2');
  //   expect(parser(md)).toEqual(json);
  // });

});