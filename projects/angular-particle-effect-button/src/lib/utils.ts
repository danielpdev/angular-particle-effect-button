export function isFunction(a: any): a is Function {
  return typeof a === 'function';
}

function stringToHyphens(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getCSSValue(el: HTMLElement, prop: string): string | undefined {
  if (prop in el.style) {
    return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
  }
}

const t = 'transform';
export const transformString = getCSSValue(document.body, t) ? t : '-webkit-' + t;

export function rand(value: number): number {
  return Math.random() * value - value / 2;
}
