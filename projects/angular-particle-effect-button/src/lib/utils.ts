export const is = {
  arr: a => Array.isArray(a),
  str: a => typeof a === 'string',
  fnc: a => typeof a === 'function'
};

export const stringToHyphens = str => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};

export const getCSSValue = (el, prop) => {
  if (prop in el.style) {
    return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0';
  }
};

export const t = 'transform';
export const transformString = getCSSValue(document.body, t) ? t : '-webkit-' + t;

export const rand = value => {
  return Math.random() * value - value / 2;
};

export const getElement = element => {
  return is.str(element) ? document.querySelector(element) : element;
};
