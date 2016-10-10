export function negatePromise(p: Promise<any>, error: string): Promise<any> {
  return new Promise((resolve, reject) => {
    p.then(() => reject(new Error(error)));
    p.catch((error) => resolve(error.message));
  });
}
