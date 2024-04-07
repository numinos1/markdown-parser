/**
 * Document Content Iterator
 */
export class LineIterator {
  private lines: string[];
  private index: number;
 
  /**
   * Constructor
   */
  constructor(text: string) {
    this.lines = text.split('\n');
    this.index = 0;
  }

  /**
   * Capture lines until regex match
   */
  until(regex: RegExp) {
    const lines: string[] = [];
    let line: string | undefined;

    while ((line = this.next()) != null) {
      if (regex.test(line)) break;
      lines.push(line);
    }
    return lines;
  }

  /**
   * Next line
   */
  next() {
    return (this.index < this.lines.length)
      ? this.lines[this.index++]
      : undefined;
  }
}