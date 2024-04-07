import { areSame } from './parse-utils';

export interface TNode {
  type: string;
  children?: TNode[];
  [name: string]: any;
}

export interface TStackEntry {
  node: TNode;
  type: string;
}

/**
 * Parse Tree
 */
export class ParseTree {
  private stack: TStackEntry[]; 

  /**
   * Constructor
   */
  constructor() {
    this.stack = [{
      node: { type: 'root' },
      type: 'root'
    }];
  }

  /**
   * Get Top of Stack
   */
  top() {
    return this.stack[
      this.stack.length - 1
    ];
  }

  /**
   * Push to Stack
   */
  pushNode(node?: TNode): ParseTree {
    if (node) {
      const top = this.top().node;

      if (!top.children) {
        top.children = [node];
      }
      else {
        top.children.push(node);
      }

      this.stack.push({
        node: node,
        type: node.type
      });
    }

    return this;
  }

  /**
   * Set Value
   */
  setValue(name: string, value: any): ParseTree {
    this.top().node[name] = value;

    return this;
  }

  /**
   * Find Section by Depth
   */
  findSection(depth?: number): ParseTree {
    while (this.stack.length > 1) {
      if (this.top().type === 'section'
        && (!depth || this.stack.length == depth))
      {
        break;
      }
      this.stack.pop();
    }

    return this;
  }

  /**
   * Find First Record (Data or Section)
   * - If type provided, find by type as well
   * - If type provided, ensure type exists
   */
  findNode(node?: any): ParseTree {
    while (this.stack.length > 1) {
      const top = this.top();

      if (areSame(node, top.node)) {
        return this;
      }
      if (top.type === 'section'
        || top.type === 'data'
      ) {
        return this.pushNode(node);
      }
      if (node
        && top.type === 'list'
        && top.node.depth < node.depth
      ) {
        return this.pushNode(node);
      }
      this.stack.pop();
    }

    return this;
  }

  /**
   * Get ParseTree Root
   */
  getRoot(): TNode {
    return this.stack[0].node;
  }
}
