export const afterDotNum = (num: number, numbersAfterDot: number = 2) => {
  const util = 10 ** numbersAfterDot;

  return Math.round(util * num) / util;
};

export const displayDecimal = (arg: number | string) => {
  if (typeof arg === 'number') {
    return afterDotNum(arg, 2);
  }

  return arg;
};
