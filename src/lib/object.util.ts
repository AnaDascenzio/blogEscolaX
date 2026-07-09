export class ObjectUtils {
  static removeUndefinedValues<T extends Record<string, unknown>>(
    obj: T,
  ): Partial<{ [K in keyof T]: Exclude<T[K], undefined> }> {
    return Object.entries(obj).reduce<Partial<{ [K in keyof T]: Exclude<T[K], undefined> }>>(
      (result, [key, value]) => {
        if (value !== undefined) {
          (result as Record<string, unknown>)[key] = value;
        }
        return result;
      },
      {},
    );
  }
}
