import { ParseTree } from './parse-tree';
import { LineIterator } from './line-iterator';
import { toValue, toBlock } from './parse-utils';

const BLANK_LINE = /^\s*$/;
const SECTION_HEADER = /^(\#+)\s*(.*)/;
const MULTI_LINE_SCALAR = /^\s*([a-zA-Z0-9_-]+):\s*([>|])$/;
const META_ATTRIBUTE = /^\s*([a-zA-Z0-9_-]+):(.*)$/;
const DIVIDING_LINE = /^---+/;
const FENCED_CODE_BLOCK = /^\`{3}(\w*)/;
const NAME_VALUE_PAIR = /^\s*(.*?)\s*=\s*(.*)\s*$/;
const LIST_ITEM = /^(\s*)(-|\+|\d+\.)\s(.*)$/;
const FILE_REFERENCE = /^\/(\S+)(.*)$/;
const LINK_REFERENCE = /^https*:\/\/(\S+)(.*)$/;
const BLOCK_QUOTE = /^\>\s*(.*)\s*$/;

/**
 * Meta Markdown Parser
 */
export function parse(text: string) {
  const doc = new LineIterator(text);
  const tree = new ParseTree();
  let matches: RegExpMatchArray | null;
  let line: string | undefined;

  while ((line = doc.next()) != null) {

    if ((matches = line.match(BLANK_LINE))) {
      tree.findNode();
    }
    else if ((matches = line.match(SECTION_HEADER))) {
      tree.findSection(matches[1].length)
        .pushNode({
          type: 'section',
          title: matches[2]
        });
    }
    else if ((matches = line.match(MULTI_LINE_SCALAR))) {
      tree.findNode()
        .setValue(
          matches[1],
          toBlock(doc.until(/^\S/), matches[2] === '>')
        );
    }
    else if ((matches = line.match(FILE_REFERENCE))) {
      tree.findSection()
        .pushNode({
          type: 'file',
          title: matches[2].trim(),
          url: matches[1]
        });
    }
    else if ((matches = line.match(LINK_REFERENCE))) {
      tree.findSection()
        .pushNode({
          type: 'href',
          title: matches[2].trim(),
          url: matches[1]
        });
    }
    else if ((matches = line.match(META_ATTRIBUTE))) {
      tree.findNode()
        .setValue(
          matches[1],
          toValue(matches[2].trim())
        );
    }
    else if ((matches = line.match(DIVIDING_LINE))) {
      tree.findSection()
        .pushNode({
          type: 'data'
        });
    }
    else if ((matches = line.match(FENCED_CODE_BLOCK))) {
      tree.findNode()
        .pushNode({
          type: 'code',
          name: matches[1] || '',
          value: toBlock(doc.until(/^\`{3}/))
        });
    }
    else if ((matches = line.match(BLOCK_QUOTE))) {
      tree.findNode()
      .pushNode({
        type: 'blockquote',
        value: matches[1] || ''
      });
    }
    else if ((matches = line.match(NAME_VALUE_PAIR))) {
      tree.findNode({
        type: 'pairs'
      })
      .pushNode({
        type: 'keyValue',
        name: matches[1],
        value: matches[2]
      });
    }
    else if ((matches = line.match(LIST_ITEM))) {
      tree.findNode({
        type: 'list',
        ordered: matches[2] !== '-',
        depth: matches[1].length
      })
      .pushNode({
        type: 'listItem',
        value: matches[3]
      });
    }
    else {
      tree.findNode()
        .pushNode({
          type: 'paragraph',
          value: line.trim()
        });
    }
  }

  return tree.getRoot();
}
