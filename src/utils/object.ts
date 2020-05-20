export default class ObjectUtil {
  static IsEmpty (obj: any) {
    return this.IsUndef(obj)
      ? true
      : Object.keys(obj).length === 0;
  }

  static IsUndef (obj: any) {
    return obj === undefined || obj === null;
  }

  static EnumToArray<E> (Enum: any): any[] {
    const values = Object.values(Enum);
    const ids = values.splice(values.length / 2);
    return ids.map((x, i) => ({
      id: x,
      value: values[i],
    }));
  }
}
