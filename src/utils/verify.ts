export const isNumber = (str: string) => {
  return !Number.isNaN(Number(str));
};

export const typeOf = (variable: any): string => {
  return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
};
