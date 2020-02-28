export const is = {
  fnc: a => typeof a === 'function',
};

const stringToHyphens = str => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

const getCSSValue = (el, prop) => {
  if (prop in el.style) {
    return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
  }
};

const t = 'transform';
export const transformString = getCSSValue(document.body, t) ? t : '-webkit-' + t;

export const rand = value => {
  return Math.random() * value - value / 2;
};
