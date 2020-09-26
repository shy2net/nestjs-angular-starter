/**
 * Generates an array mock objects from the generator function.
 * @param generateFn
 * @param count
 */
export function generateMockArray<T>(generateFn: (index: number) => T, count: number): T[] {
  const output: T[] = [];
  for (let i = 0; i < count; i++) output.push(generateFn(i));

  return output;
}
