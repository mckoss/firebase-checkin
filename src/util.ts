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
