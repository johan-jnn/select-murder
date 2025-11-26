export type MaybePromise<T> = T | Promise<T>;

/**
 * Filter an array with async function
 * @see https://stackoverflow.com/a/46842181/15234457
 * @param array The array to filter
 */
export async function asyncFilter<T>(
  array: T[],
  filterer: (item: T) => MaybePromise<boolean>
): Promise<T[]> {
  const CLEAR = Symbol();
  return (
    await Promise.all(array.map(async (item) => ((await filterer(item)) ? item : CLEAR)))
  ).filter((item) => item !== CLEAR) as T[];
}
