import _ from 'lodash'

export default class ArrayUtil {
  static mix (array: any[]) {
    const newArray: any[] = [];
    const copyArray: any[] = _.cloneDeep(array);
    const rand: number = _.random(0, copyArray.length - 1);
    let item: any = copyArray.splice(rand, 1).pop();
    while (item !== undefined) {
      newArray.push(item);
      const rand: number = _.random(0, copyArray.length - 1);
      item = copyArray.splice(rand, 1).pop();
    }
    return newArray;
  }

  static toMatrix (array: any[], width: number) {
    const newArray: any[] = [];
    const copyArray: any[] = _.cloneDeep(array);
    let item: any[] = copyArray.splice(0, width);
    while (item.length !== 0) {
      newArray.push(item);
      item = copyArray.splice(0, width);
    }
    return newArray;
  }
}