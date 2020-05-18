export default class ObjectUtil {
  static IsEmpty (obj: any) {
    return this.IsUndef(obj)
      ? true
      : Object.keys(obj).length === 0;
  }

  static IsUndef (obj: any) {
    return obj === undefined || obj === null;
  }
}
