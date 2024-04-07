const IS_INT = /^\-*[0-9]+$/;
const IS_FLOAT = /^\-*[0-9]+\.[0-9]+$/;
const IS_TRUE = /^true$/i;
const IS_FALSE = /^false$/i;

/**
 * Parse a Value for Int | Float | Boolean | String
 */
 export function toValue(value: string): any {
  if (IS_TRUE.test(value)) {
    return true;
  }
  if (IS_FALSE.test(value)) {
    return false;
  }
  if (IS_INT.test(value)) {
    return parseInt(value, 10);
  }
  if (IS_FLOAT.test(value)) {
    return parseFloat(value);
  }
  return value;
 }

/**
 * Convert lines to block of text
 */
export function toBlock(
  lines: string[],
  isFolded: boolean = false
): string {
  if (!isFolded) {
    return lines.join('\n');
  }
  return lines
    .map(line => line.trim() || '\n')
    .join(' ')
    .replace(/\s*\n\s*/, '\n')
    .trim();
}

/**
 * Compare Node props
 */
export function areSame(
  find: Record<string, any> | undefined,
  within: Record<string, any>
): boolean {
  if (!find) return false;

  for (let key in find) {
    if (find[key] !== within[key]) {
      return false;
    }
  }
  return true;
}