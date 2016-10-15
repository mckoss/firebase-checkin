// Misc utilities

export function project(obj: Object, props: string[]): {[prop: string]: any} {
  let result: {[prop: string]: any}  = {};
  for (let prop of props) {
    if (prop in obj) {
      result[prop] = (obj as any)[prop];
    }
  }
  return result;
}

export function deepCopy<T>(value: T): T {
  return deepExtend(undefined, value);
}

export function deepExtend(target: any, source: any): any {
  if (!(source instanceof Object)) {
    return source;
  }

  switch (source.constructor) {
  case Date:
    let dateValue = (source as any) as Date;
    return new Date(dateValue.getTime());

  case Object:
    if (target === undefined) {
      target = {};
    }
    break;

  case Array:
    // Always copy the array source and overwrite the target.
    target = [];
    break;

  default:
    // Not a plain Object - treat it as a scalar.
    return source;
  }

  for (let prop in source) {
    if (!source.hasOwnProperty(prop)) {
      continue;
    }
    target[prop] = deepExtend(target[prop], source[prop]);
  }

  return target;
}
