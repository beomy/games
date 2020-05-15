export default class MatrixUtil {
  static multiply (a: number[][], b: number[][]) {
    return a.map((row) => {
      return row.map((_, i) => {
        return row.reduce((sum, cell, j) => {
            return sum + cell * b[j][i];
        },0);
      });
    });
  }
};
