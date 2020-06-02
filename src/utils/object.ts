export default class ObjectUtil {
  public static isEmpty (obj: any): boolean {
    return this.isUndef(obj)
      ? true
      : Object.keys(obj).length === 0;
  }

  public static isUndef (obj: any): boolean {
    return obj === undefined || obj === null;
  }

  public static enumToArray<E> (Enum: any): any[] {
    const values = Object.values(Enum);
    const ids = values.splice(values.length / 2);
    return ids.map((x, i) => ({
      id: x,
      value: values[i],
    }));
  }
}
