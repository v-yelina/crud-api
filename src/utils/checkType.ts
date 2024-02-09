export const isCorrectType = <T>(obj: T, iface: T): boolean => {
  const keys = Object.keys(obj) as (keyof T)[];

  const hasRequiredProps = keys.every(prop => {
    return keys.includes(prop) && typeof obj[prop] === typeof iface[prop];
  });

  const hasExtraProps = Object.keys(obj).length === keys.length;

  return hasRequiredProps && hasExtraProps;
};