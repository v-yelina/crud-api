export const isCorrectType = <T extends object>(obj: T, iface: T): boolean => {
  const objKeys = Object.keys(obj) as (keyof T)[];
  const ifaceKeys = Object.keys(iface) as (keyof T)[];

  // Check if all required properties of the interface are present in the object
  const hasRequiredProps = ifaceKeys.every(key => objKeys.includes(key));

  // Check if there are any extra properties in the object
  const hasExtraProps = objKeys.length === ifaceKeys.length;

  // Check if properties in the object have the same types as properties in the interface
  const hasSameTypes = objKeys.every(key => typeof obj[key] === typeof iface[key]);

  return hasRequiredProps && hasExtraProps && hasSameTypes;
};