export default class NumberUtil {
  static random (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static ratioRandom (values: number[], ratios: number[]): number {
    const list: number[] = [];
    for (let i = 0; i < ratios.length; i++) {
      const ratio = ratios[i];
      const value = values[i];
      for (let j = 0; j < ratio; j++) {
        list.push(value);
      }
    }
    return list[this.random(0, list.length - 1)];
  }
};
