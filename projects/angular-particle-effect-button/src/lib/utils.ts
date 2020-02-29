export function isFunction(a: any): a is Function {
  return typeof a === 'function';
}

export function rand(value: number): number {
  return Math.random() * value - value / 2;
}
