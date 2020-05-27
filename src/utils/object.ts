export default class ObjectUtil {
  public static IsEmpty (obj: any): boolean {
    return this.IsUndef(obj)
      ? true
      : Object.keys(obj).length === 0;
  }

  public static IsUndef (obj: any): boolean {
    return obj === undefined || obj === null;
  }

  public static EnumToArray<E> (Enum: any): any[] {
    const values = Object.values(Enum);
    const ids = values.splice(values.length / 2);
    return ids.map((x, i) => ({
      id: x,
      value: values[i],
    }));
  }
}
